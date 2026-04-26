interface StaffTabsProps {
    activeTab: string;
    onChangeTab: (tab: string) => void;
}

const ROLES = ["All", "Administrators", "Doctors", "Receptionists", "Lab Technicians", "Lab Managers"];

export const StaffTabs = ({activeTab, onChangeTab}: StaffTabsProps) => {
    return (
        <ul className="nav nav-pills mb-4 bg-white p-2 rounded shadow-sm">
            {ROLES.map((role) => (
                <li key={role} className="nav-item">
                    <button
                        className={`nav-link border-0 ${activeTab === role ? "active fw-bold" : "text-muted"}`}
                        onClick={() => onChangeTab(role)}
                        style={{transition: "all 0.3s ease"}}
                    >
                        {role}
                    </button>
                </li>
            ))}
        </ul>
    );
};

