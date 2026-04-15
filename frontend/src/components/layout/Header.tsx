interface HeaderProps {
    userRole?: 'ADMIN' | 'RECEPTIONIST' | 'DOCTOR';
    onLogout: () => void;
}

export const Header = ({userRole, onLogout}: HeaderProps) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow mb-4">
            <div className="container-fluid">
                <a className="navbar-brand fw-bold" href="#">
                    <i className="fa-solid fa-hospital-user me-2"></i>
                    Medical Center
                </a>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {userRole === 'ADMIN' && (
                            <li className="nav-item">
                                <a className="nav-link active" href="#">MANAGE STAFF</a>
                            </li>
                        )}

                        {userRole === 'RECEPTIONIST' && (
                            <>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link border-0 text-white">PATIENTS</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link border-0 text-white opacity-75">VISITS
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        <span className="text-white small">
                             Logged in as: <strong>{userRole || 'Guest'}</strong>
                        </span>
                        <button className="btn btn-light btn-sm shadow-sm" onClick={onLogout}>
                            <i className="fa-solid fa-right-from-bracket me-2"></i>
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};