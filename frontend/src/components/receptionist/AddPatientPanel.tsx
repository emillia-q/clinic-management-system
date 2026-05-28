import {useState} from 'react';
import axios from "axios";

interface AddPatientPanelProps {
    onClose: () => void;
    onRefresh: () => void;
}

export const AddPatientPanel = ({onClose, onRefresh}: AddPatientPanelProps) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        socialSecurityNo: '',
        email: '',
        phoneNumber: '',
        address: {
            street: '',
            houseNo: '',
            city: '',
            postalCode: '00-000'
        }
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (name: string, value: string) => {
        let error = "";
        if (name === 'firstName' && value.length < 2) error = "Name is too short";
        if (name === 'lastName' && value.length < 2) error = "Last name is too short";
        if (name === 'socialSecurityNo' && !/^\d{11}$/.test(value)) error = "PESEL must be 11 digits";
        if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) error = "Invalid email format";

        if (name === 'dateOfBirth') {
            const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
            if (!dateRegex.test(value)) {
                error = "Required format: YYYY-MM-DD";
            }
        }

        setErrors(prev => ({...prev, [name]: error}));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
        validateField(name, value);
    };

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/v1/patients'
    });
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    const handleAdd = async () => {
        try {

            const response = await api.post("", formData );

            if (response.status >= 200 && response.status < 300) {
                onRefresh();
                onClose();
            } else {
                const rawText = await response.data();
                console.log("server response:", rawText);

                alert("DEBUG:\n" + rawText);
            }
        } catch (error) {
            alert("No connection: " + error);
        }
    };
    return (
        <div className="card shadow-sm border-0 h-100 position-sticky" style={{top: "20px"}}>
            <div className="card-header bg-white border-0 pt-3 px-3">
                <h5 className="mb-0 fw-bold text-primary">Add New Patient</h5>
            </div>

            <div className="card-body px-4 d-flex flex-column">
                <div className="mt-2 pt-3 border-top overflow-auto" style={{maxHeight: '70vh'}}>

                    <div className="mb-3">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{fontSize: '0.7rem'}}>First
                            Name:</small>
                        <input
                            name="firstName"
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                        {errors.firstName && <div className="invalid-feedback small">{errors.firstName}</div>}
                    </div>

                    <div className="mb-3">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{fontSize: '0.7rem'}}>Last
                            Name:</small>
                        <input
                            name="lastName"
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                        {errors.lastName && <div className="invalid-feedback small">{errors.lastName}</div>}
                    </div>

                    <div className="mb-3">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{fontSize: '0.7rem'}}>Date
                            of Birth:</small>
                        <input
                            name="dateOfBirth"
                            type="text"
                            placeholder="YYYY-MM-DD"
                            className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                        />
                        {errors.dateOfBirth && <div className="invalid-feedback small">{errors.dateOfBirth}</div>}
                    </div>

                    <div className="mb-3">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1"
                               style={{fontSize: '0.7rem'}}>Pesel:</small>
                        <input
                            name="socialSecurityNo"
                            className={`form-control ${errors.socialSecurityNo ? 'is-invalid' : ''}`}
                            value={formData.socialSecurityNo}
                            onChange={handleInputChange}
                        />
                        {errors.socialSecurityNo &&
                            <div className="invalid-feedback small">{errors.socialSecurityNo}</div>}
                    </div>

                    <div className="mb-3">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1"
                               style={{fontSize: '0.7rem'}}>E-mail:</small>
                        <input
                            name="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        {errors.email && <div className="invalid-feedback small">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{fontSize: '0.7rem'}}>Phone
                            Number:</small>
                        <input
                            name="phoneNumber"
                            className="form-control"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1"
                               style={{fontSize: '0.7rem'}}>Address:</small>
                        <input
                            className="form-control mb-2"
                            placeholder="Street"
                            value={formData.address.street}
                            onChange={e => setFormData({
                                ...formData,
                                address: {...formData.address, street: e.target.value}
                            })}
                        />
                        <div className="row g-2">
                            <div className="col-4">
                                <input className="form-control" placeholder="No." value={formData.address.houseNo}
                                       onChange={e => setFormData({
                                           ...formData,
                                           address: {...formData.address, houseNo: e.target.value}
                                       })}/>
                            </div>
                            <div className="col-8">
                                <input className="form-control" placeholder="City" value={formData.address.city}
                                       onChange={e => setFormData({
                                           ...formData,
                                           address: {...formData.address, city: e.target.value}
                                       })}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-3 border-top d-grid gap-2">
                    <button className="btn btn-primary fw-bold py-2 shadow-sm" onClick={handleAdd}>
                        <i className="fa-solid fa-user-plus me-2"></i>Add Patient
                    </button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};