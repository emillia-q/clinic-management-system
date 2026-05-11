import './App.css';
import { Header } from "./components/layout/Header.tsx";
import { AdminDashboard } from "./pages/AdminDashboard/AdminDashboard.tsx";
import { PatientsPage } from "./pages/ReceptionistDashboard/PatientsPage.tsx";
import { NewVisitPage } from "./pages/ReceptionistDashboard/NewVisitPage.tsx";
import { VisitsPage } from "./pages/ReceptionistDashboard/VisitsPage.tsx";
import { OrderExamPage } from "./pages/DoctorDashboard/OrderExamPage.tsx";
import { useState } from "react";
import { LoginPage } from "./pages/LoginPage.tsx";

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
                ) : role === "Receptionist" ? (
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
                ) : role === "Doctor" ? (
                    <>
                        {currentView === 'VISITS' && (
                            !selectedVisitId ? (
                                <div className="container py-5">
                                    <h2 className="fw-bold mb-4 text-start">Doctor's Appointments</h2>
                                    <div className="card shadow-sm border-0 p-5 text-center bg-light">
                                        <i className="fa-solid fa-calendar-check fa-3x mb-3 opacity-25"></i>
                                        <p className="text-muted">Appointment list component will be integrated here.</p>
                                        <div className="mt-4">
                                            <button
                                                className="btn btn-dark fw-bold px-4 py-2"
                                                onClick={() => setSelectedVisitId(1)}
                                            >
                                                <i className="fa-solid fa-microscope me-2"></i>
                                                Example: Order Exam for Visit #1
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <OrderExamPage
                                    visitId={selectedVisitId}
                                    onBack={() => setSelectedVisitId(null)}
                                />
                            )
                        )}

                        {currentView === 'PATIENTS' && (
                            <div className="container py-5 text-start">
                                <h2 className="fw-bold mb-4">Patient Records</h2>
                                <div className="alert alert-secondary">
                                    Doctor's patient search and history view.
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="container py-5">
                        <div className="alert alert-info">
                            This role is authenticated, but dashboard UI is not implemented yet for: <strong>{role}</strong>.
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;