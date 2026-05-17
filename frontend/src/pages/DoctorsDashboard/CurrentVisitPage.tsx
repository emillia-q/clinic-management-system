import { useState } from 'react';

interface CurrentVisitPageProps {
    onBack: () => void;
    onOrderExam: () => void;
}

const CurrentVisitPage = ({ onBack, onOrderExam }: CurrentVisitPageProps) => {
    const [visitData, setVisitData] = useState({
        patientName: "Maria Wójcik",
        time: "8:00 AM",
        date: "13.05.2026",
        diagnosis: "",
        description: ""
    });

    const [showFinishModal, setShowFinishModal] = useState(false);
    const [showBackModal, setShowBackModal] = useState(false);

    const handleConfirmFinish = () => {
        console.log("Finishing visit:", visitData);
        setShowFinishModal(false);
        onBack();
    };

    const flatlyDark = "#2C3E50";
    const flatlyLight = "#ECF0F1";

    return (
        <div className="min-vh-100 bg-white font-sans position-relative">
            <nav className="navbar navbar-dark" style={{ backgroundColor: flatlyDark, padding: '15px 40px' }}>
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-4 fw-bold">
                        <span className="text-white cursor-pointer" style={{ borderBottom: '2px solid white' }}>VISITS</span>
                        <span className="text-secondary cursor-pointer">PATIENTS</span>
                    </div>
                    <div>
                        <button className="btn btn-outline-light btn-sm fw-bold px-3 py-1 text-uppercase">
                            Log out
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 p-5 rounded shadow-sm position-relative" style={{ backgroundColor: flatlyLight }}>

                        <button
                            onClick={() => setShowBackModal(true)}
                            className="btn btn-link p-0 fs-3 text-decoration-none position-absolute start-0 top-0 mt-4 ms-4"
                            style={{ color: flatlyDark }}
                        >
                            ←
                        </button>

                        <h2 className="text-center fw-bold mb-5 pt-2" style={{ color: flatlyDark }}>
                            Visit: {visitData.patientName} ({visitData.time})
                        </h2>

                        <div className="px-2 text-start">
                            <div className="mb-4">
                                <label className="form-label fw-bold fs-5" style={{ color: flatlyDark }}>Diagnosis</label>
                                <textarea
                                    className="form-control border-2"
                                    rows={3}
                                    value={visitData.diagnosis}
                                    onChange={(e) => setVisitData({...visitData, diagnosis: e.target.value})}
                                    style={{ borderRadius: '4px', resize: 'none', borderColor: flatlyDark }}
                                />
                            </div>

                            <div className="mb-5">
                                <label className="form-label fw-bold fs-5" style={{ color: flatlyDark }}>Description</label>
                                <textarea
                                    className="form-control border-2"
                                    rows={6}
                                    value={visitData.description}
                                    onChange={(e) => setVisitData({...visitData, description: e.target.value})}
                                    style={{ borderRadius: '4px', resize: 'none', borderColor: flatlyDark }}
                                />
                            </div>

                            <div className="d-grid gap-3">
                                <button
                                    onClick={onOrderExam}
                                    className="btn fw-bold py-2 text-uppercase"
                                    style={{ backgroundColor: 'transparent', color: flatlyDark, border: `2px solid ${flatlyDark}`, borderRadius: '4px' }}
                                >
                                    Order a new exam
                                </button>

                                <button
                                    onClick={() => setShowFinishModal(true)}
                                    className="btn py-3 fw-bold text-uppercase text-white"
                                    style={{ backgroundColor: flatlyDark, borderRadius: '4px', border: 'none' }}
                                >
                                    Finish Visit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showFinishModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="bg-white p-4 rounded shadow-lg text-center border-0" style={{ maxWidth: '400px', width: '90%' }}>
                        <h4 className="fw-bold mb-3" style={{ color: flatlyDark }}>Finish Visit?</h4>
                        <p className="text-muted mb-4">Are you sure you want to finish visit for <strong>{visitData.patientName}</strong> on <strong>{visitData.date}</strong>?</p>
                        <div className="d-flex gap-2 justify-content-center">
                            <button onClick={handleConfirmFinish} className="btn px-4 py-2 text-white fw-bold" style={{ backgroundColor: flatlyDark, borderRadius: '4px' }}>YES</button>
                            <button onClick={() => setShowFinishModal(false)} className="btn btn-outline-secondary px-4 py-2 fw-bold" style={{ borderRadius: '4px' }}>CANCEL</button>
                        </div>
                    </div>
                </div>
            )}

            {showBackModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="bg-white p-4 rounded shadow-lg text-center border-0" style={{ maxWidth: '400px', width: '90%' }}>
                        <h4 className="fw-bold mb-3" style={{ color: flatlyDark }}>Discard changes?</h4>
                        <p className="text-muted mb-4">All unsaved changes in diagnosis and description will be lost.</p>
                        <div className="d-flex gap-2 justify-content-center">
                            <button
                                onClick={onBack}
                                className="btn px-4 py-2 text-white fw-bold"
                                style={{ backgroundColor: flatlyDark, borderRadius: '4px' }}
                            >
                                YES, DISCARD
                            </button>
                            <button
                                onClick={() => setShowBackModal(false)}
                                className="btn btn-outline-secondary px-4 py-2 fw-bold"
                                style={{ borderRadius: '4px' }}
                            >
                                NO, STAY
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentVisitPage;