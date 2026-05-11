export interface AddLabExamRequest {
    visitId: number;
    examName: string;
    notes: string;
}

export interface AddPhysicalExamRequest {
    visitId: number;
    examName: string;
    results: string;
}