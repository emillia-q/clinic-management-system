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
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
            }}
        >
            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", minWidth: "320px" }}>
                <h3 style={{ marginTop: 0 }}>{title}</h3>
                <p>{message}</p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                    <button onClick={onCancel} style={{ padding: "8px 16px" }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} style={{ padding: "8px 16px" }}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
