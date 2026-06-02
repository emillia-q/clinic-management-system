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
import CurrentVisitPage from '../pages/doctor/CurrentVisitPage';
import {DoctorPatientHistoryPage} from '../pages/doctor/PatientHistoryPage';
import type {PatientDto} from '../features/patients/types/patient.types';

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
    const [doctorSubView, setDoctorSubView] = useState<'LIST' | 'CURRENT_VISIT' | 'ORDER_EXAM' | 'HISTORY'>('LIST');
    const [activePatientData, setActivePatientData] = useState<PatientDto | null>(null);

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
        setDoctorSubView('LIST');
        setActivePatientData(null);
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
            setDoctorSubView('LIST');
        }
    };

    const handlePasswordChanged = () => {
        setRequiresPasswordChange(false);
        if (role === 'Administrator') {
            setCurrentView('ADMIN');
        } else {
            setCurrentView('VISITS');
            setDoctorSubView('LIST');
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
                    setDoctorSubView('LIST');
                    setActivePatientData(null);
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

                        {currentView === 'VISITS' && (() => {
                            switch (doctorSubView) {
                                case 'HISTORY':
                                    return (
                                        <DoctorPatientHistoryPage
                                            patient={activePatientData!}
                                            onBack={() => setDoctorSubView('CURRENT_VISIT')}
                                        />
                                    );

                                case 'ORDER_EXAM':
                                    return (
                                        <OrderExamPage
                                            visitId={orderExamVisitId || doctorSelectedVisitId!}
                                            onBack={() => {
                                                setOrderExamVisitId(null);
                                                setDoctorSubView('CURRENT_VISIT');
                                            }}
                                        />
                                    );

                                case 'CURRENT_VISIT':
                                    return (
                                        <CurrentVisitPage
                                            visitId={doctorSelectedVisitId!}
                                            onBack={() => {
                                                setDoctorSelectedVisitId(null);
                                                setOrderExamVisitId(null);
                                                setDoctorSubView('LIST');
                                            }}
                                            onOrderExam={() => {
                                                setOrderExamVisitId(doctorSelectedVisitId);
                                                setDoctorSubView('ORDER_EXAM');
                                            }}
                                            onViewHistory={(patientObj) => {
                                                setActivePatientData(patientObj);
                                                setDoctorSubView('HISTORY');
                                            }}
                                        />
                                    );

                                case 'LIST':
                                default:
                                    return (
                                        <DoctorVisitsPage
                                            onOrderExam={(visitId) => {
                                                setDoctorSelectedVisitId(visitId);
                                                setOrderExamVisitId(visitId);
                                                setDoctorSubView('ORDER_EXAM');
                                            }}
                                            onStartVisit={(visitId) => {
                                                setDoctorSelectedVisitId(visitId);
                                                setDoctorSubView('CURRENT_VISIT');
                                            }}
                                        />
                                    );
                            }
                        })()}
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