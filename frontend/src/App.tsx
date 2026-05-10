import './App.css'
import {Header} from "./components/layout/Header.tsx";
import {AdminDashboard} from "./pages/AdminDashboard/AdminDashboard.tsx";
import {PatientsPage} from "./pages/ReceptionistDashboard/PatientsPage.tsx";
import {DoctorPatientsPage} from "./pages/DoctorsDashboard/DoctorsPatientsPage.tsx";
import {NewVisitPage} from "./pages/ReceptionistDashboard/NewVisitPage.tsx";
import {VisitsPage} from "./pages/ReceptionistDashboard/VisitsPage.tsx";
import {useState} from "react";
import {LoginPage} from "./pages/LoginPage.tsx";

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
        return <LoginPage onLoginSuccess={handleLoginSuccess}/>;
    }

    return (
        <div className="App">
            <Header
                userRole={role}
                onLogout={handleLogout}
                onViewChange={(view: any) => setCurrentView(view)}
                currentView={currentView}
            />

            <main>
                {role === "Administrator" ? (
                    <AdminDashboard/>
                ) : role === "Receptionist" ? (
                    <>
                        {currentView === 'VISITS' && (
                            <VisitsPage onNewVisit={() => setCurrentView('NEW_VISIT')}/>
                        )}

                        {currentView === 'PATIENTS' && (
                            <PatientsPage onScheduleVisit={handleScheduleVisit}/>
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
                ) : role == "Doctor" ? (
                    <>
                        {currentView === 'PATIENTS' && (
                            <DoctorPatientsPage/>
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