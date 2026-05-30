import {SegmentedTabs} from '../../../shared/ui/SegmentedTabs';

interface StaffTabsProps {
    activeTab: string;
    onChangeTab: (tab: string) => void;
}

const ROLES = ['All', 'Administrators', 'Doctors', 'Receptionists', 'Lab Technicians', 'Lab Managers'];

export const StaffTabs = ({activeTab, onChangeTab}: StaffTabsProps) => (
    <SegmentedTabs
        tabs={ROLES}
        activeTab={activeTab}
        onTabChange={onChangeTab}
        className="mb-4"
    />
);
