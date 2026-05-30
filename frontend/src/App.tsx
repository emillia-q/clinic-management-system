import './App.css';
import { Header } from "./components/layout/Header.tsx";
import { AdminDashboard } from "./pages/AdminDashboard/AdminDashboard.tsx";
import { PatientsPage } from "./pages/ReceptionistDashboard/PatientsPage.tsx";
import { DoctorPatientsPage } from "./pages/DoctorsDashboard/DoctorsPatientsPage.tsx";
import { DoctorVisitsPage } from "./pages/DoctorsDashboard/DoctorVisitsPage.tsx";
import { NewVisitPage } from "./pages/ReceptionistDashboard/NewVisitPage.tsx";
import { VisitsPage } from "./pages/ReceptionistDashboard/VisitsPage.tsx";
import { OrderExamPage } from "./pages/DoctorsDashboard/OrderExamPage.tsx";
import { useState } from "react";
import { LoginPage } from "./pages/LoginPage.tsx";
import { ChangePasswordPage } from "./pages/ChangePasswordPage.tsx";
import { Toaster } from 'react-hot-toast';
import {LaborantDashbord} from "./pages/LaborantDashbord/LaborantDashbord.tsx";
import { LabManagerDashboard } from "./pages/LabManagerDashboard/LabManagerDashboard.tsx";
import type { VisitDto } from "./features/visits/types/visit.types.ts";


type UserRole = "Administrator" | "Doctor" | "Receptionist" | "LabTechnician" | "LabManager";

const getStoredRole = (): UserRole | null => {
    const role = localStorage.getItem("userRole");
    if (
        role === "Administrator" ||
        role === "Doctor" ||
        role === "Receptionist" ||
        role === "LabTechnician" ||
        role === "LabManager"
    ) {
        return role;
    }
    return null;
};

const getInitialView = (): 'PATIENTS' | 'NEW_VISIT' | 'VISITS' | 'ADMIN' => {
    return getStoredRole() === "Administrator" ? "ADMIN" : "VISITS";
};

function App() {
    const [currentView, setCurrentView] = useState<'PATIENTS' | 'NEW_VISIT' | 'VISITS' | 'ADMIN'>(getInitialView);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [doctorSelectedVisitId, setDoctorSelectedVisitId] = useState<number | null>(null);
    const [orderExamVisitId, setOrderExamVisitId] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");
    const [role, setRole] = useState<UserRole | null>(getStoredRole());
    const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
    const [preferredVisitDate, setPreferredVisitDate] = useState<string>("");
    const [editingVisit, setEditingVisit] = useState<VisitDto | null>(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("login");
        localStorage.removeItem("isAuthenticated");
        setRole(null);
        setIsAuthenticated(false);
        setCurrentView("VISITS");
        setSelectedPatientId(null);
        setDoctorSelectedVisitId(null);
        setOrderExamVisitId(null);
        setEditingVisit(null);
    };

    const handleLoginSuccess = (loggedRole: UserRole, passwdChangeRequired: boolean) => {
        setRole(loggedRole);
        setIsAuthenticated(true);
        if (passwdChangeRequired) {
            setRequiresPasswordChange(true);
        } else if (loggedRole === "Administrator") {
            setCurrentView("ADMIN");
        } else {
            setCurrentView("VISITS");
        }
    };

    const handlePasswordChanged = () => {
        setRequiresPasswordChange(false);
        if (role === "Administrator") {
            setCurrentView("ADMIN");
        } else {
            setCurrentView("VISITS");
        }
    };

    const handleScheduleVisit = (patientId: number) => {
        setSelectedPatientId(patientId);
        setEditingVisit(null);
        setCurrentView('NEW_VISIT');
    };

    if (!isAuthenticated || !role) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    if (requiresPasswordChange) {
        return <ChangePasswordPage onPasswordChanged={handlePasswordChanged} />;
    }

    return (
        <div className="App">
            <Toaster position="top-center" />
            <Header
                userRole={role}
                onLogout={handleLogout}
                onViewChange={(view: 'PATIENTS' | 'NEW_VISIT' | 'VISITS' | 'ADMIN') => {
                    setCurrentView(view);
                    setDoctorSelectedVisitId(null);
                    setOrderExamVisitId(null);
                    setEditingVisit(null);
                }}
                currentView={role === "Administrator" ? "ADMIN" : currentView}
            />

            <main>
                {role === "Administrator" ? (
                    <AdminDashboard />
                ) : role === "Receptionist" ? (
                    <>
                        {currentView === 'VISITS' && (
                            <VisitsPage
                                onNewVisit={(visitToEdit, preferredDate) => {
                                    if (visitToEdit) {
                                        setEditingVisit(visitToEdit);
                                        setPreferredVisitDate("");
                                    } else {
                                        setEditingVisit(null);
                                        setPreferredVisitDate(preferredDate || "");
                                    }
                                    setCurrentView('NEW_VISIT');
                                }}
                            />
                        )}
                        {currentView === 'PATIENTS' && (
                            <PatientsPage onScheduleVisit={handleScheduleVisit} />
                        )}
                        {currentView === 'NEW_VISIT' && (
                            <NewVisitPage
                                initialPatientId={selectedPatientId}
                                visitToEdit={editingVisit}
                                preferredDate={preferredVisitDate}
                                onBack={() => {
                                    setCurrentView('VISITS');
                                    setSelectedPatientId(null);
                                    setEditingVisit(null);
                                    setPreferredVisitDate("");
                                }}
                            />
                        )}
                    </>
                ) : role === "Doctor" ? (
                    <>
                        {currentView === 'PATIENTS' && (
                            <DoctorPatientsPage />
                        )}

                        {currentView === 'VISITS' && (
                            orderExamVisitId ? (
                                <OrderExamPage
                                    visitId={orderExamVisitId}
                                    onBack={() => setOrderExamVisitId(null)}
                                />
                            ) : (
                                <DoctorVisitsPage
                                    selectedVisitId={doctorSelectedVisitId}
                                    onSelectedVisitIdChange={setDoctorSelectedVisitId}
                                    onOrderExam={(visitId) => {
                                        setDoctorSelectedVisitId(visitId);
                                        setOrderExamVisitId(visitId);
                                    }}
                                />
                            )
                        )}
                    </>
                ) : role === "LabTechnician" ? (
                    <LaborantDashbord />
                ) : role === "LabManager" ? (
                    <LabManagerDashboard />
                ) : (
                    <div className="container py-5">
                        <div className="alert alert-info">
                            Dashboard for <strong>{role}</strong> is under construction.
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;