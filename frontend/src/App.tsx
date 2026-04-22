import './App.css'
import {Header} from "./components/layout/Header.tsx";
import {AdminDashboard} from "./pages/AdminDashboard/AdminDashboard.tsx";
import {PatientsPage} from "./pages/ReceptionistDashboard/PatientsPage.tsx";
import {NewVisitPage} from "./pages/ReceptionistDashboard/NewVisitPage.tsx";
import {VisitsPage} from "./pages/ReceptionistDashboard/VisitsPage.tsx";
import {useState} from "react";

function App() {
    const [currentView, setCurrentView] = useState<'PATIENTS' | 'NEW_VISIT' | 'VISITS' | 'ADMIN'>('VISITS');
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [role] = useState<'ADMIN' | 'RECEPTIONIST'>('RECEPTIONIST');

    const handleLogout = () => {
        console.log("User logged out");
    };

    const handleScheduleVisit = (patientId: number) => {
        setSelectedPatientId(patientId);
        setCurrentView('NEW_VISIT');
    };

    return (
        <div className="App">
            <Header
                userRole={role}
                onLogout={handleLogout}
                onViewChange={(view: any) => setCurrentView(view)}
                currentView={currentView}
            />

            <main>
                {role === 'ADMIN' ? (
                    <AdminDashboard/>
                ) : (
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
                )}
            </main>
        </div>
    );
}

export default App;