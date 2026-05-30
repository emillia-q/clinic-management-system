import {SegmentedTabs} from '../../shared/ui/SegmentedTabs';

interface VisitTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const VisitTabs = ({tabs, activeTab, onTabChange}: VisitTabsProps) => (
    <SegmentedTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        uppercase
    />
);
