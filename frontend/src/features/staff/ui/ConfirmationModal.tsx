interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmationModal = ({
                                      isOpen,
                                      title,
                                      message,
                                      onConfirm,
                                      onCancel
                                  }: ConfirmationModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal d-block" tabIndex={-1} style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title fw-bold text-primary">
                            <i className="fa-solid fa-circle-question me-2"></i>
                            {title}
                        </h5>
                        <button type="button" className="btn-close" onClick={onCancel} aria-label="Close"></button>
                    </div>

                    <div className="modal-body py-4">
                        <p className="mb-0 fs-5 text-secondary">{message}</p>
                    </div>

                    <div className="modal-footer border-0 pb-4">
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary px-4 shadow-sm"
                            onClick={onConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

