export interface Question {
  id: number;
  category: string;
  categoryIcon: string;
  left: string;
  right: string;
  leftScore: number;  // negative for progressive, positive for conservative
  rightScore: number;
}

export interface Answer {
  questionId: number;
  choice: "left" | "right";
  leftScore: number;
  rightScore: number;
}

export interface Demographics {
  age?: string;
  gender?: string;
  region?: string;
}

export interface CategoryScore {
  name: string;
  score: number;
  tendency: string;
  description: string;
}

export interface AnalysisResult {
  sessionId: string;
  politicalScore: number;
  politicalLabel: string;
  aiAnalysis: string;
  categoryScores: Record<string, CategoryScore>;
}
