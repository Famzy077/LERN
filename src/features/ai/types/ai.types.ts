export interface UploadMaterialRequest {
  courseId?: string;
  file: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface Material {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  courseId: string | null;
  status: "UPLOADED" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

export interface AISummary {
  id: string;
  materialId: string;
  title: string;
  content: string;
  keyPoints: string[];
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedReadTime: number;
  createdAt: string;
}

export interface GenerateQuizFromSummary {
  summaryId: string;
  numberOfQuestions: number;
}
