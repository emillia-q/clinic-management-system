import { formatStaffRole } from "../../features/staff/utils/formatStaffRole.ts";

interface HeaderProps {
    userRole?: "Administrator" | "Doctor" | "Receptionist" | "LabTechnician" | "LabManager";
    onLogout: () => void;
    onViewChange: (view: 'PATIENTS' | 'VISITS' | 'ADMIN') => void;
    currentView: string;
}

export const Header = ({ userRole, onLogout, onViewChange, currentView }: HeaderProps) => {

    const storedFirstName = localStorage.getItem('firstName') || localStorage.getItem('userFirstName');
    const storedLastName = localStorage.getItem('lastName') || localStorage.getItem('userLastName');
    const storedLogin = localStorage.getItem('login');

    let displayFormattedName = "Staff Member";

    if (storedFirstName || storedLastName) {
        displayFormattedName = `${storedFirstName || ''} ${storedLastName || ''}`.trim();
    } else if (storedLogin) {
        displayFormattedName = storedLogin;
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow mb-4">
            <div className="container-fluid">
                <span className="navbar-brand fw-bold mb-0 h1" style={{ cursor: 'default', pointerEvents: 'none' }}>
                    <i className="fa-solid fa-hospital-user me-2"></i>
                    Medical Center
                </span>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
                        {userRole === 'Receptionist' && (
                            <>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link btn btn-link border-0 text-white p-2 ${currentView === 'VISITS' ? 'fw-bold' : 'opacity-75'}`}
                                        onClick={() => onViewChange('VISITS')}
                                        style={{ boxShadow: 'none' }}
                                    >
                                        VISITS
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link btn btn-link border-0 text-white p-2 ${currentView === 'PATIENTS' ? 'fw-bold' : 'opacity-75'}`}
                                        onClick={() => onViewChange('PATIENTS')}
                                        style={{ boxShadow: 'none' }}
                                    >
                                        PATIENTS
                                    </button>
                                </li>
                            </>
                        )}

                        {userRole === 'Doctor' && (
                            <>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link btn btn-link border-0 text-white p-2 ${currentView === 'VISITS' ? 'fw-bold' : 'opacity-75'}`}
                                        onClick={() => onViewChange('VISITS')}
                                        style={{ boxShadow: 'none' }}
                                    >
                                        VISITS
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link btn btn-link border-0 text-white p-2 ${currentView === 'PATIENTS' ? 'fw-bold' : 'opacity-75'}`}
                                        onClick={() => onViewChange('PATIENTS')}
                                        style={{ boxShadow: 'none' }}
                                    >
                                        PATIENTS
                                    </button>
                                </li>
                            </>
                        )}

                        {userRole === 'Administrator' && (
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className={`nav-link btn btn-link border-0 text-white p-2 ${currentView === 'ADMIN' ? 'fw-bold' : 'opacity-75'}`}
                                    onClick={() => onViewChange('ADMIN')}
                                    style={{ boxShadow: 'none' }}
                                >
                                    MANAGE STAFF
                                </button>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex align-items-center">
                        <div
                            className="d-flex flex-column align-items-end text-white text-end lh-sm"
                            style={{ marginRight: '24px' }}
                        >
                            <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Logged in as:</span>
                            <span className="fw-bold fs-5 my-0">
                                {displayFormattedName}
                            </span>
                            <span className="fst-italic opacity-75 mt-05" style={{ fontSize: '0.8rem' }}>
                                — {formatStaffRole(userRole)}
                            </span>
                        </div>

                        <button className="btn btn-light btn-sm shadow-sm px-3 py-2 fw-semibold" onClick={onLogout}>
                            <i className="fa-solid fa-right-from-bracket me-2"></i>
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};