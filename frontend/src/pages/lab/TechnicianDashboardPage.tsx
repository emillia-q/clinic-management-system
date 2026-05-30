import {useEffect, useState} from "react";
import type {LabExamDetails} from '../../features/lab/types'
import {labTechnicianApi} from '../../features/lab/api/labTechnicianApi.ts'
import {SearchExamType} from "../../features/lab/ui/SearchExamType.tsx";
import {ExamList} from "../../features/lab/ui/ExamList.tsx";
import {ExamDetails} from "../../features/lab/ui/ExamDetails.tsx";
import {DASHBOARD_PAGE_CLASS, SPLIT_PANEL_TRANSITION_STYLE} from "../../shared/ui/styles";


export const TechnicianDashboardPage = () => {
    const [exams, setExams] = useState<LabExamDetails[]>([]);
    const [filteredExams, setFilteredExams] = useState<LabExamDetails[]>([]);
    const [selectedExam, setSelectedExam] = useState<LabExamDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await labTechnicianApi.getPendingLabExamsList();
            setExams(data);
            setFilteredExams(data);
            console.log(data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        void loadData();
    }, []);
    const handleSearch = (params: string | null) => {
        if (!params) {
            setFilteredExams(exams);
            return;
        }
        params = params.toLowerCase();
        setFilteredExams(exams.filter((exam) =>
            exam.patientName.toLowerCase().includes(params) ||
            exam.patientPesel.toLowerCase().includes(params)
        ));
    };
    const handleSelectExam = async (exam: LabExamDetails) => {
        setSelectedExam(exam);
    };
    const completeExamWithResult = async (result: string) => {
        if (!selectedExam) return;
        await labTechnicianApi.submitResult(selectedExam.id, result);
        await loadData();
        setSelectedExam(null);
    };
    const cancelExamWithReason = async (reason: string) => {
        if (!selectedExam) return;
        await labTechnicianApi.cancelExam(selectedExam.id, reason);
        await loadData();
        setSelectedExam(null);
    };

    return (
        <div className={DASHBOARD_PAGE_CLASS}>
            {/*Search by patient*/}
            <div className="row mb-4 align-items-end">
                <SearchExamType onSearch={handleSearch}/>
            </div>

            <div className="row g-4">
                {/*List of pending exams:*/}
                <div className={(selectedExam) ? "col-md-8" : "col-md-12"}
                     style={SPLIT_PANEL_TRANSITION_STYLE}>
                    <ExamList
                        exams={filteredExams}
                        isLoading={isLoading}
                        onSelectExam={handleSelectExam}
                        selectedExamId={selectedExam?.id}
                    />
                </div>

                {/*Exam details:*/}
                <div className="col-md-4">
                    {selectedExam && (
                        <ExamDetails
                            exam={selectedExam}
                            onClose={() => setSelectedExam(null)}
                            onCompleteExam={completeExamWithResult}
                            onCancelExam={cancelExamWithReason}
                        />
                    )}
                </div>

            </div>

        </div>
    );
}