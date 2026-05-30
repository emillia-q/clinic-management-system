interface VisitTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const VisitTabs = ({tabs, activeTab, onTabChange}: VisitTabsProps) => (
    <div className="btn-group w-100 mb-0 shadow-sm">
        {tabs.map(tab => (
            <button
                key={tab}
                className={`btn py-3 fw-bold border-2 ${activeTab === tab ? 'btn-dark' : 'btn-light'}`}
                onClick={() => onTabChange(tab)}
                style={{
                    flex: 1,
                    borderRadius: 0,
                    backgroundColor: activeTab === tab ? '#2c3e50' : '#f8f9fa',
                    color: activeTab === tab ? '#ffffff' : '#333333',
                }}
            >
                {tab.toUpperCase()}
            </button>
        ))}
    </div>
);