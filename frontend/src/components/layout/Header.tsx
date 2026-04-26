interface HeaderProps {
    userRole?: "Administrator" | "Doctor" | "Receptionist" | "LabTechnician" | "LabManager";
    onLogout: () => void;
    onViewChange: (view: 'PATIENTS' | 'VISITS' | 'ADMIN') => void;
    currentView: string;
}

export const Header = ({userRole, onLogout, onViewChange, currentView}: HeaderProps) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow mb-4">
            <div className="container-fluid">
                <span className="navbar-brand fw-bold mb-0 h1" style={{cursor: 'default', pointerEvents: 'none'}}>
                    <i className="fa-solid fa-hospital-user me-2"></i>
                    Medical Center
                </span>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
                        {userRole === 'Receptionist' && (
                            <>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link btn btn-link border-0 text-white ${currentView === 'VISITS' ? 'active fw-bold border-bottom' : 'opacity-75'}`}
                                        onClick={() => onViewChange('VISITS')}
                                    >
                                        VISITS
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link btn btn-link border-0 text-white ${currentView === 'PATIENTS' ? 'active fw-bold border-bottom' : 'opacity-75'}`}
                                        onClick={() => onViewChange('PATIENTS')}
                                    >
                                        PATIENTS
                                    </button>
                                </li>
                            </>
                        )}

                        {userRole === 'Administrator' && (
                            <li className="nav-item">
                                <button
                                    className={`nav-link btn btn-link border-0 text-white ${currentView === 'ADMIN' ? 'active fw-bold border-bottom' : 'opacity-75'}`}
                                    onClick={() => onViewChange('ADMIN')}
                                >
                                    MANAGE STAFF
                                </button>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        <span className="text-white small">
                             Logged in as: <strong>{userRole || 'Guest'}</strong>
                        </span>
                        <button className="btn btn-light btn-sm shadow-sm px-3" onClick={onLogout}>
                            <i className="fa-solid fa-right-from-bracket me-2"></i>
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};