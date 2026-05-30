import {useEffect, useState} from 'react';
import type {LabExamDetails} from '../../features/lab/types/types.tsx';
import {SearchExamType} from '../../features/lab/ui/SearchExamType.tsx';
import {ManagerExamList} from '../../features/lab/ui/ManagerExamList.tsx';
import {ManagerVerificationDetails} from '../../features/lab/ui/ManagerVerificationDetails.tsx';
import {VisitTabs} from '../../components/receptionist/VisitTabs.tsx';
import {DASHBOARD_PAGE_CLASS} from '../../shared/ui/styles';
import {LAB_MANAGER_TAB_LABELS} from '../../shared/ui/status';

const STATUS_TABS = ['Completed', 'Validated', 'Rejected'];

export const LabManagerDashboard = () => {
    const [exams, setExams] = useState<LabExamDetails[]>([]);
    const [filteredExams, setFilteredExams] = useState<LabExamDetails[]>([]);
    const [activeTab, setActiveTab] = useState<string>('Completed');
    const [selectedExam, setSelectedExam] = useState<LabExamDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

    const fetchExams = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = activeTab === 'Completed'
                ? `${baseUrl}/lab-manager/exams/to-verify`
                : `${baseUrl}/lab-manager/exams?status=${activeTab}`;

            const response = await fetch(url, {
                headers: {Authorization: `Bearer ${token}`},
            });

            if (response.ok) {
                const data: LabExamDetails[] = await response.json();
                setExams(data);
                setFilteredExams(data);
            } else {
                console.error('Błąd pobierania badań:', await response.text());
                setExams([]);
                setFilteredExams([]);
            }
        } catch (error) {
            console.error('Błąd sieci:', error);
            setExams([]);
            setFilteredExams([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchExams();
    }, [activeTab]);

    const handleSearch = (params: string | null) => {
        if (!params) {
            setFilteredExams(exams);
            return;
        }
        const query = params.toLowerCase();
        setFilteredExams(exams.filter((exam) =>
            exam.patientName.toLowerCase().includes(query) ||
            exam.patientPesel.toLowerCase().includes(query) ||
            exam.examName.toLowerCase().includes(query)
        ));
    };

    const handleAction = async (examId: number, action: 'approve' | 'reject', notes = '') => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseUrl}/lab-manager/exams/${examId}/${action}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({notes}),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Action failed with response:', errorText);
                alert(`Błąd: ${errorText}`);
                return;
            }

            setSelectedExam(null);
            await fetchExams();
        } catch (error) {
            console.error('Action failed:', error);
            alert('Błąd podczas zapisywania akcji!');
        }
    };

    return (
        <div className={DASHBOARD_PAGE_CLASS}>
            <div className="row mb-4 align-items-end">
                <SearchExamType onSearch={handleSearch}/>
            </div>

            <div className="row g-4">
                <div className={selectedExam ? 'col-md-8' : 'col-md-12'} style={{transition: 'all 0.3s ease'}}>
                    <VisitTabs
                        tabs={STATUS_TABS}
                        activeTab={activeTab}
                        tabLabels={LAB_MANAGER_TAB_LABELS}
                        onTabChange={(tab) => {
                            setActiveTab(tab);
                            setSelectedExam(null);
                        }}
                    />

                    <ManagerExamList
                        exams={filteredExams}
                        isLoading={isLoading}
                        onSelectExam={(exam) => setSelectedExam(exam)}
                        selectedExamId={selectedExam?.id}
                    />
                </div>

                <div className="col-md-4">
                    {selectedExam && (
                        <ManagerVerificationDetails
                            key={selectedExam.id}
                            exam={selectedExam}
                            onClose={() => setSelectedExam(null)}
                            onApprove={(examId) => void handleAction(examId, 'approve')}
                            onReject={(examId, notes) => void handleAction(examId, 'reject', notes)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
