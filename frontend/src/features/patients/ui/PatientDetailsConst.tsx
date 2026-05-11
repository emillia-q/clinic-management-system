import type {PatientDto} from "../types/patient.types.ts";

interface PatientDetailsProps {
    patient: PatientDto | null;
    onClose: () => void;
}

export const PatientDetailsConst = ({patient, onClose}: PatientDetailsProps) => {
    // If no patient is selected, render nothing
    if (!patient) return null;

    return (
        <div //className="card shadow-sm border-0 h-100 position-sticky" style={{ top: "20px" }}
        >
            {/* Header with Close Button */}
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-3 px-3">
                <h5 className="mb-0 fw-bold text-primary">Patient Profile</h5>
                <button
                    className="btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center"
                    onClick={onClose}
                    style={{width: "32px", height: "32px", border: "1px solid #dee2e6"}}
                >
                    <i className="fa-solid fa-xmark text-dark"></i>
                </button>
            </div>

            <div className="card-body px-4 d-flex flex-column">
                {/* Avatar and Name Section */}
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center me-3"
                         style={{width: "64px", height: "64px", minWidth: "64px"}}>
                        <i className="fa-solid fa-user text-white fa-2x"></i>
                    </div>
                    <div>
                        <h4 className="fw-bold mb-0 text-dark">{patient.firstName} {patient.lastName}</h4>
                        <span className="text-muted small">ID: {patient.id}</span>
                    </div>
                </div>

                {/* Patient Information List */}
                <div className="mt-2 pt-3 border-top overflow-auto" style={{maxHeight: '60vh'}}>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>Name:</small>
                        <span className="text-dark">{patient.firstName}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1" style={{fontSize: '0.7rem'}}>Last
                            Name:</small>
                        <span className="text-dark">{patient.lastName}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1" style={{fontSize: '0.7rem'}}>Date
                            of Birth:</small>
                        <span className="text-dark">{patient.dateOfBirth}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>PESEL:</small>
                        <span className="text-dark font-monospace">{patient.socialSecurityNo}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>E-mail:</small>
                        <span className="text-primary">{patient.email}</span>
                    </div>

                    <div className="mb-2 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1" style={{fontSize: '0.7rem'}}>Phone
                            Number:</small>
                        <span className="text-dark">{patient.phoneNumber}</span>
                    </div>

                    <div className="mb-3 d-flex align-items-baseline">
                        <small className="text-muted d-block text-uppercase fw-bold me-1"
                               style={{fontSize: '0.7rem'}}>Address:</small>
                        <span className="text-dark small">
                            {patient.address.street} {patient.address.houseNo}, {patient.address.city}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};