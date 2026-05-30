import './App.css';
import {Header} from './layout/Header';
import {AdminPage} from '../pages/admin/AdminPage';
import {PatientsPage} from '../pages/receptionist/PatientsPage';
import {DoctorPatientsPage} from '../pages/doctor/PatientsPage';
import {DoctorVisitsPage} from '../pages/doctor/VisitsPage';
import {NewVisitPage} from '../pages/receptionist/NewVisitPage';
import {VisitsPage} from '../pages/receptionist/VisitsPage';
import {OrderExamPage} from '../pages/doctor/OrderExamPage';
import {useState} from 'react';
import {LoginPage} from '../pages/auth/LoginPage';
import {ChangePasswordPage} from '../pages/auth/ChangePasswordPage';
import {Toaster} from 'react-hot-toast';
import {TechnicianDashboardPage} from '../pages/lab/TechnicianDashboardPage';
import {ManagerDashboardPage} from '../pages/lab/ManagerDashboardPage';
import type {VisitDto} from '../features/visits/types/visit.types';

type UserRole = 'Administrator' | 'Doctor' | 'Receptionist' | 'LabTechnician' | 'LabManager';

const getStoredRole = (): UserRole | null => {
    const role = localStorage.getItem('userRole');
    if (
        role === 'Administrator' ||
        role === 'Doctor' ||
        role === 'Receptionist' ||
        role === 'LabTechnician' ||
        role === 'LabManager'
    ) {
        return role;
    }
    return null;
};

const getInitialView = (): 'PATIENTS' | 'NEW_VISIT' | 'VISITS' | 'ADMIN' => {
    return getStoredRole() === 'Administrator' ? 'ADMIN' : 'VISITS';
};

function App() {
    const [currentView, setCurrentView] = useState<'PATIENTS' | 'NEW_VISIT' | 'VISITS' | 'ADMIN'>(getInitialView);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [doctorSelectedVisitId, setDoctorSelectedVisitId] = useState<number | null>(null);
    const [orderExamVisitId, setOrderExamVisitId] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
    const [role, setRole] = useState<UserRole | null>(getStoredRole());
    const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
    const [preferredVisitDate, setPreferredVisitDate] = useState<string>('');
    const [editingVisit, setEditingVisit] = useState<VisitDto | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('login');
        localStorage.removeItem('isAuthenticated');
        setRole(null);
        setIsAuthenticated(false);
        setCurrentView('VISITS');
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
        } else if (loggedRole === 'Administrator') {
            setCurrentView('ADMIN');
        } else {
            setCurrentView('VISITS');
        }
    };

    const handlePasswordChanged = () => {
        setRequiresPasswordChange(false);
        if (role === 'Administrator') {
            setCurrentView('ADMIN');
        } else {
            setCurrentView('VISITS');
        }
    };

    const handleScheduleVisit = (patientId: number) => {
        setSelectedPatientId(patientId);
        setEditingVisit(null);
        setCurrentView('NEW_VISIT');
    };

    if (!isAuthenticated || !role) {
        return <LoginPage onLoginSuccess={handleLoginSuccess}/>;
    }

    if (requiresPasswordChange) {
        return <ChangePasswordPage onPasswordChanged={handlePasswordChanged}/>;
    }

    return (
        <div className="App">
            <Toaster position="top-center"/>
            <Header
                userRole={role}
                onLogout={handleLogout}
                onViewChange={(view: 'PATIENTS' | 'NEW_VISIT' | 'VISITS' | 'ADMIN') => {
                    setCurrentView(view);
                    setDoctorSelectedVisitId(null);
                    setOrderExamVisitId(null);
                    setEditingVisit(null);
                }}
                currentView={role === 'Administrator' ? 'ADMIN' : currentView}
            />

            <main>
                {role === 'Administrator' ? (
                    <AdminPage/>
                ) : role === 'Receptionist' ? (
                    <>
                        {currentView === 'VISITS' && (
                            <VisitsPage
                                onNewVisit={(visitToEdit, preferredDate) => {
                                    if (visitToEdit) {
                                        setEditingVisit(visitToEdit);
                                        setPreferredVisitDate('');
                                    } else {
                                        setEditingVisit(null);
                                        setPreferredVisitDate(preferredDate || '');
                                    }
                                    setCurrentView('NEW_VISIT');
                                }}
                            />
                        )}
                        {currentView === 'PATIENTS' && (
                            <PatientsPage onScheduleVisit={handleScheduleVisit}/>
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
                                    setPreferredVisitDate('');
                                }}
                            />
                        )}
                    </>
                ) : role === 'Doctor' ? (
                    <>
                        {currentView === 'PATIENTS' && (
                            <DoctorPatientsPage/>
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
                ) : role === 'LabTechnician' ? (
                    <TechnicianDashboardPage/>
                ) : role === 'LabManager' ? (
                    <ManagerDashboardPage/>
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
