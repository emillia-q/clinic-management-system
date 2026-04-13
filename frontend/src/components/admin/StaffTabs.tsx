interface StaffTabsProps {
    activeTab: string;
    onChangeTab: (tab: string) => void;
}

const ROLES = ["All", "Doctor", "Receptionist", "LabTechnician", "LabManager"];

export const StaffTabs = ({ activeTab, onChangeTab }: StaffTabsProps) => {
    return (
        <div className="tabs">
            {ROLES.map((role) => (
                <button
                    key={role}
                    onClick={() => onChangeTab(role)}
                    style={{ fontWeight: activeTab === role ? "bold" : "normal" }}
                >
                    {role}
                </button>
            ))}
        </div>
    );
};
