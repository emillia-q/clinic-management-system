import {
    TAB_ACTIVE_BG,
    TAB_ACTIVE_COLOR,
    TAB_INACTIVE_BG,
    TAB_INACTIVE_COLOR,
    UI_BORDER_RADIUS,
} from './styles';

export interface SegmentedTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    uppercase?: boolean;
    className?: string;
}

export const SegmentedTabs = ({
    tabs,
    activeTab,
    onTabChange,
    uppercase = false,
    className = 'mb-0',
}: SegmentedTabsProps) => (
    <div
        className={`btn-group w-100 shadow-sm overflow-hidden ${className}`}
        style={{borderRadius: UI_BORDER_RADIUS}}
    >
        {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
                <button
                    key={tab}
                    type="button"
                    className={`btn py-3 fw-bold border-2 ${isActive ? 'btn-dark' : 'btn-light'}`}
                    onClick={() => onTabChange(tab)}
                    style={{
                        flex: 1,
                        borderRadius: 0,
                        backgroundColor: isActive ? TAB_ACTIVE_BG : TAB_INACTIVE_BG,
                        color: isActive ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR,
                    }}
                >
                    {uppercase ? tab.toUpperCase() : tab}
                </button>
            );
        })}
    </div>
);
