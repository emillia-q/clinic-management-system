import {SegmentedTabs} from '../../shared/ui/SegmentedTabs';

interface VisitTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    tabLabels?: Record<string, string>;
}

export const VisitTabs = ({tabs, activeTab, onTabChange, tabLabels}: VisitTabsProps) => (
    <SegmentedTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabLabels={tabLabels}
        uppercase
    />
);
