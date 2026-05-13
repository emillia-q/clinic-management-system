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
import { Toaster } from 'react-hot-toast';


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

function App() {
    const [currentView, setCurrentView] = useState<'PATIENTS' | 'NEW_VISIT' | 'VISITS' | 'ADMIN'>('VISITS');
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");
    const [role, setRole] = useState<UserRole | null>(getStoredRole());

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
        setSelectedVisitId(null);
    };

    const handleLoginSuccess = (loggedRole: UserRole) => {
        setRole(loggedRole);
        setIsAuthenticated(true);
        if (loggedRole === "Administrator") {
            setCurrentView("ADMIN");
        } else {
            setCurrentView("VISITS");
        }
    };

    const handleScheduleVisit = (patientId: number) => {
        setSelectedPatientId(patientId);
        setCurrentView('NEW_VISIT');
    };

    if (!isAuthenticated || !role) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="App">
            <Toaster position="top-center" />
            <Header
                userRole={role}
                onLogout={handleLogout}
                onViewChange={(view: any) => {
                    setCurrentView(view);
                    setSelectedVisitId(null);
                }}
                currentView={currentView}
            />

            <main>
                {role === "Administrator" ? (
                        <AdminDashboard />
                    ) :

                    role === "Receptionist" ? (
                            <>
                                {currentView === 'VISITS' && (
                                    <VisitsPage onNewVisit={() => setCurrentView('NEW_VISIT')} />
                                )}
                                {currentView === 'PATIENTS' && (
                                    <PatientsPage onScheduleVisit={handleScheduleVisit} />
                                )}
                                {currentView === 'NEW_VISIT' && (
                                    <NewVisitPage
                                        initialPatientId={selectedPatientId}
                                        onBack={() => {
                                            setCurrentView('VISITS');
                                            setSelectedPatientId(null);
                                        }}
                                    />
                                )}
                            </>
                        ) :

                        role === "Doctor" ? (
                            <>
                                {currentView === 'PATIENTS' && (
                                    <DoctorPatientsPage />
                                )}

                                {currentView === 'VISITS' && (
                                    !selectedVisitId ? (
                                        <DoctorVisitsPage onOrderExam={(visitId) => setSelectedVisitId(visitId)} />
                                    ) : (
                                        <OrderExamPage
                                            visitId={selectedVisitId}
                                            onBack={() => setSelectedVisitId(null)}
                                        />
                                    )
                                )}
                            </>
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