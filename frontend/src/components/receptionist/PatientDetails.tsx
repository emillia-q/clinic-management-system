import {useState, useEffect} from 'react';
import type {PatientDto} from "../../features/patients/types/patient.types.ts";

interface PatientDetailsProps {
    patient: PatientDto | null;
    onClose: () => void;
    onRefresh: () => void;
    onSchedule: (id: number) => void;
}

export const PatientDetails = ({patient, onClose, onRefresh, onSchedule}: PatientDetailsProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<PatientDto | null>(null);

    useEffect(() => {
        if (patient) {
            setEditData(JSON.parse(JSON.stringify(patient)));
        }
        setIsEditing(false);
    }, [patient]);

    if (!patient || !editData) return null;

    const handleSave = async () => {
        if (!editData) return;

        const payload = {
            id: editData.id,
            firstName: editData.firstName,
            lastName: editData.lastName,
            socialSecurityNo: editData.socialSecurityNo,
            dateOfBirth: editData.dateOfBirth, //YYYY-MM-DD
            email: editData.email,
            phoneNumber: editData.phoneNumber,
            address: {
                city: editData.address.city,
                street: editData.address.street,
                houseNo: editData.address.houseNo,
                postalCode: editData.address.postalCode || "00-000",
                flatNumber: editData.address.flatNumber || ""
            }
        };

        console.log("Sending payload to backend:", payload);

        try {
            const response = await fetch("http://localhost:8080/api/v1/patients", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setIsEditing(false);
                onRefresh();
                alert("Patient updated successfully!");
            } else {
                const errorData = await response.text();
                console.error("Backend error response:", errorData);
                alert(`Update failed: ${response.status}. Check console for details.`);
            }
        } catch (error) {
            console.error("Network/Connection error:", error);
            alert("Could not connect to the server.");
        }
    };
    return (
        <div className="card shadow-sm border-0 h-100 position-sticky" style={{top: "20px"}}>
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

                <div className="mt-2 pt-3 border-top overflow-auto" style={{maxHeight: '60vh'}}>

                    <div className="mb-2">
                        <small className="text-muted d-block text-uppercase fw-bold"
                               style={{fontSize: '0.7rem'}}>Name:</small>
                        {isEditing ? (
                            <input className="form-control form-control-sm" value={editData.firstName}
                                   onChange={e => setEditData({...editData, firstName: e.target.value})}/>
                        ) : <span className="text-dark">{patient.firstName}</span>}
                    </div>

                    <div className="mb-2">
                        <small className="text-muted d-block text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>Last
                            Name:</small>
                        {isEditing ? (
                            <input className="form-control form-control-sm" value={editData.lastName}
                                   onChange={e => setEditData({...editData, lastName: e.target.value})}/>
                        ) : <span className="text-dark">{patient.lastName}</span>}
                    </div>

                    <div className="mb-2">
                        <small className="text-muted d-block text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>Date
                            of Birth:</small>
                        {isEditing ? (
                            <input type="date" className="form-control form-control-sm" value={editData.dateOfBirth}
                                   onChange={e => setEditData({...editData, dateOfBirth: e.target.value})}/>
                        ) : <span className="text-dark">{patient.dateOfBirth}</span>}
                    </div>

                    <div className="mb-2">
                        <small className="text-muted d-block text-uppercase fw-bold"
                               style={{fontSize: '0.7rem'}}>PESEL:</small>
                        {isEditing ? (
                            <input className="form-control form-control-sm" value={editData.socialSecurityNo}
                                   onChange={e => setEditData({...editData, socialSecurityNo: e.target.value})}/>
                        ) : <span className="text-dark font-monospace">{patient.socialSecurityNo}</span>}
                    </div>

                    <div className="mb-2">
                        <small className="text-muted d-block text-uppercase fw-bold"
                               style={{fontSize: '0.7rem'}}>E-mail:</small>
                        {isEditing ? (
                            <input type="email" className="form-control form-control-sm" value={editData.email}
                                   onChange={e => setEditData({...editData, email: e.target.value})}/>
                        ) : <span className="text-primary">{patient.email}</span>}
                    </div>

                    <div className="mb-2">
                        <small className="text-muted d-block text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>Phone
                            Number:</small>
                        {isEditing ? (
                            <input type="tel" className="form-control form-control-sm" value={editData.phoneNumber}
                                   onChange={e => setEditData({...editData, phoneNumber: e.target.value})}/>
                        ) : <span className="text-dark">{patient.phoneNumber}</span>}
                    </div>

                    <div className="mb-3">
                        <small className="text-muted d-block text-uppercase fw-bold"
                               style={{fontSize: '0.7rem'}}>Address:</small>
                        {isEditing ? (
                            <div className="d-grid gap-1">
                                <input className="form-control form-control-sm" placeholder="Street"
                                       value={editData.address.street}
                                       onChange={e => setEditData({
                                           ...editData,
                                           address: {...editData.address, street: e.target.value}
                                       })}/>
                                <div className="d-flex gap-1">
                                    <input className="form-control form-control-sm w-50" placeholder="H. No"
                                           value={editData.address.houseNo}
                                           onChange={e => setEditData({
                                               ...editData,
                                               address: {...editData.address, houseNo: e.target.value}
                                           })}/>
                                    <input className="form-control form-control-sm w-50" placeholder="City"
                                           value={editData.address.city}
                                           onChange={e => setEditData({
                                               ...editData,
                                               address: {...editData.address, city: e.target.value}
                                           })}/>
                                </div>
                            </div>
                        ) : (
                            <span className="text-dark small">
                                {patient.address.street} {patient.address.houseNo}, <br/>
                                {patient.address.city}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-3 border-top">
                    {isEditing ? (
                        <div className="d-grid gap-2">
                            <button className="btn btn-success fw-bold py-2 shadow-sm" onClick={handleSave}>
                                <i className="fa-solid fa-check me-2"></i>Save Changes
                            </button>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="d-grid">
                            <button
                                className="btn btn-outline-dark fw-bold py-2 shadow-sm mb-2"
                                onClick={() => onSchedule(patient.id)}
                            >
                                Schedule a New Visit
                            </button>
                            <div className="text-end">
                                <button className="btn p-0 border-0" onClick={() => setIsEditing(true)}>
                                    <i className="fa-solid fa-pen-to-square fs-4 text-dark shadow-hover"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};