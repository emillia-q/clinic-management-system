import React, { useState } from 'react';

interface ChangePasswordPageProps {
    onPasswordChanged: () => void;
}

export const ChangePasswordPage = ({ onPasswordChanged }: ChangePasswordPageProps) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch((import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1") + '/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword, confirmPassword })
            });

            if (response.ok || response.status === 204) {
                onPasswordChanged();
            } else {
                const data = await response.json().catch(() => null);
                setError(data?.message ?? 'Failed to change password. Please try again.');
            }
        } catch {
            setError('Connection error. Please check if the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow border-0 p-4" style={{ width: '100%', maxWidth: '420px', borderRadius: '15px' }}>
                <div className="text-center mb-4">
                    <div
                        className="bg-warning d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{ width: '60px', height: '60px' }}>
                        <i className="fa-solid fa-key text-white fs-3"></i>
                    </div>
                    <h3 className="fw-bold text-dark">Set New Password</h3>
                    <p className="text-muted small">
                        This is your first login. Please set a new password to continue.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger py-2 small text-center" role="alert">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>{error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-secondary text-uppercase">New Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="fa-solid fa-lock text-muted small"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control border-start-0 ps-0"
                                placeholder="Min. 8 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-secondary text-uppercase">Confirm Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="fa-solid fa-lock text-muted small"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control border-start-0 ps-0"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-warning w-100 fw-bold py-2 shadow-sm text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        ) : (
                            <i className="fa-solid fa-floppy-disk me-2"></i>
                        )}
                        Save Password
                    </button>
                </form>
            </div>
        </div>
    );
};