import React, {useState} from 'react';

type UserRole = "Administrator" | "Doctor" | "Receptionist" | "LabTechnician" | "LabManager";

interface LoginResponse {
    token: string;
    role: UserRole;
    userId: number;
    login: string;
    passwdChangeRequired: boolean;
}

interface LoginPageProps {
    onLoginSuccess: (role: UserRole, passwdChangeRequired: boolean) => void;
}

export const LoginPage = ({onLoginSuccess}: LoginPageProps) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [loginError, setLoginError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoginError(null);
        setPasswordError(null);

        let hasError = false;

        if (!login || login.trim() === "") {
            setLoginError("Username is required.");
            hasError = true;
        }

        if (!password || password.trim() === "") {
            setPasswordError("Password is required.");
            hasError = true;
        }

        if (hasError) return;

        setIsLoading(true);

        try {
            const response = await fetch((import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1") + "/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({login, password})
            });

            if (response.ok) {
                const data: LoginResponse = await response.json();

                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('userId', data.userId.toString());
                localStorage.setItem('login', data.login);
                localStorage.setItem('isAuthenticated', 'true');

                onLoginSuccess(data.role, data.passwdChangeRequired);
            } else {
                setError("Invalid username or password");
            }
        } catch (err) {
            setError("Connection error. Please check if the backend is running.");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow border-0 p-4" style={{width: '100%', maxWidth: '400px', borderRadius: '15px'}}>
                <div className="text-center mb-4">
                    <div
                        className="bg-primary d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{width: '60px', height: '60px'}}>
                        <i className="fa-solid fa-house-medical text-white fs-3"></i>
                    </div>
                    <h3 className="fw-bold text-dark">Clinic Management</h3>
                    <p className="text-muted small">Please enter your credentials to log in</p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 small text-center" role="alert">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>{error}
                    </div>
                )}

                <form onSubmit={handleLogin} noValidate>
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-secondary text-uppercase">Username</label>
                        <div className="input-group">
                            <span className={`input-group-text bg-white border-end-0 ${loginError ? 'border-danger text-danger' : ''}`}>
                                <i className="fa-solid fa-user text-muted small"></i>
                            </span>
                            <input
                                type="text"
                                className={`form-control border-start-0 ps-0 ${loginError ? 'is-invalid border-danger' : ''}`}
                                placeholder="Enter username"
                                value={login}
                                onChange={(e) => {
                                    setLogin(e.target.value);
                                    if (e.target.value.trim() !== "") setLoginError(null);
                                }}
                            />
                        </div>
                        {loginError && (
                            <div className="text-danger fw-bold small mt-1" style={{ fontSize: '0.8rem' }}>
                                {loginError}
                            </div>
                        )}
                    </div>

                    <div className="mb-4 text-start">
                        <label className="form-label small fw-bold text-secondary text-uppercase">Password</label>
                        <div className="input-group">
                            <span className={`input-group-text bg-white border-end-0 ${passwordError ? 'border-danger text-danger' : ''}`}>
                                <i className="fa-solid fa-lock text-muted small"></i>
                            </span>
                            <input
                                type="password"
                                className={`form-control border-start-0 ps-0 ${passwordError ? 'is-invalid border-danger' : ''}`}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (e.target.value.trim() !== "") setPasswordError(null);
                                }}
                            />
                        </div>
                        {passwordError && (
                            <div className="text-danger fw-bold small mt-1" style={{ fontSize: '0.8rem' }}>
                                {passwordError}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold py-2 shadow-sm text-uppercase"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        ) : (
                            <i className="fa-solid fa-right-to-bracket me-2"></i>
                        )}
                        Sign In
                    </button>
                </form>

                <div className="text-center mt-4">
                    <small className="text-muted">Having trouble? Contact your system administrator.</small>
                </div>
            </div>
        </div>
    );
};