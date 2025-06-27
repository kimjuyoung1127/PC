import type { Answer, CategoryScore } from "@/types/quiz";
import { questions } from "./questions";

export function calculatePoliticalScore(answers: Answer[]): number {
  const totalScore = answers.reduce((sum, answer) => {
    if (answer.choice === "left") {
      return sum + answer.leftScore;
    } else {
      return sum + answer.rightScore;
    }
  }, 0);

  // Normalize to 0-100 scale where 0 is most progressive, 100 is most conservative
  const minPossibleScore = questions.reduce((sum, q) => sum + Math.min(q.leftScore, q.rightScore), 0);
  const maxPossibleScore = questions.reduce((sum, q) => sum + Math.max(q.leftScore, q.rightScore), 0);
  
  const normalizedScore = ((totalScore - minPossibleScore) / (maxPossibleScore - minPossibleScore)) * 100;
  return Math.round(normalizedScore);
}

export function getPoliticalLabel(score: number): string {
  if (score < 30) return "진보";
  if (score < 45) return "중도-진보";
  if (score < 55) return "중도";
  if (score < 70) return "중도-보수";
  return "보수";
}

export function calculateCategoryScores(answers: Answer[]): Record<string, CategoryScore> {
  const categories = [...new Set(questions.map(q => q.category))];
  const categoryScores: Record<string, CategoryScore> = {};

  categories.forEach(category => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const categoryAnswers = answers.filter(a => 
      categoryQuestions.some(q => q.id === a.questionId)
    );

    const totalScore = categoryAnswers.reduce((sum, answer) => {
      if (answer.choice === "left") {
        return sum + answer.leftScore;
      } else {
        return sum + answer.rightScore;
      }
    }, 0);

    const minScore = categoryQuestions.reduce((sum, q) => sum + Math.min(q.leftScore, q.rightScore), 0);
    const maxScore = categoryQuestions.reduce((sum, q) => sum + Math.max(q.leftScore, q.rightScore), 0);
    
    const normalizedScore = ((totalScore - minScore) / (maxScore - minScore)) * 100;
    const roundedScore = Math.round(normalizedScore);

    let tendency: string;
    let description: string;

    if (roundedScore < 30) {
      tendency = "진보";
      description = getCategoryDescription(category, "진보");
    } else if (roundedScore < 45) {
      tendency = "중도-진보";
      description = getCategoryDescription(category, "중도-진보");
    } else if (roundedScore < 55) {
      tendency = "중도";
      description = getCategoryDescription(category, "중도");
    } else if (roundedScore < 70) {
      tendency = "중도-보수";
      description = getCategoryDescription(category, "중도-보수");
    } else {
      tendency = "보수";
      description = getCategoryDescription(category, "보수");
    }

    categoryScores[category] = {
      name: category,
      score: roundedScore,
      tendency,
      description,
    };
  });

  return categoryScores;
}

function getCategoryDescription(category: string, tendency: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    "경제 / 복지": {
      "진보": "복지 확대와 경제적 평등을 중시",
      "중도-진보": "복지와 시장경제의 균형을 추구",
      "중도": "복지와 경제 성장의 균형을 추구",
      "중도-보수": "시장 경제 우선하되 필요한 복지 인정",
      "보수": "시장 경제와 개인 책임을 강조",
    },
    "안보 / 외교": {
      "진보": "대화와 협력을 통한 평화 추구",
      "중도-진보": "대화 우선하되 현실적 안보 고려",
      "중도": "대화와 견제의 균형잡힌 접근",
      "중도-보수": "안보 우선하되 대화 가능성 열어둠",
      "보수": "강경한 안보 정책과 동맹 강화",
    },
    "사회 / 젠더": {
      "진보": "다양성과 포용을 적극 지지",
      "중도-진보": "다양성 지지하되 점진적 변화 선호",
      "중도": "다양성과 전통의 균형 추구",
      "중도-보수": "전통 가치 우선하되 다양성 부분 인정",
      "보수": "전통적 가치와 질서를 중시",
    },
    "교육 / 세대": {
      "진보": "교육 평등과 기회 균등을 중시",
      "중도-진보": "평등과 능력주의의 조화 추구",
      "중도": "공정성과 다양성의 균형 추구",
      "중도-보수": "능력주의 우선하되 기회 평등 고려",
      "보수": "능력과 노력에 따른 차별화 지지",
    },
    "시장 / 대기업": {
      "진보": "대기업 규제와 중소기업 보호 중시",
      "중도-진보": "규제와 시장 효율의 균형 추구",
      "중도": "시장 원리와 규제의 조화 추구",
      "중도-보수": "시장 자유 우선하되 필요한 규제 인정",
      "보수": "자유시장과 기업 활동의 자율성 중시",
    },
    "환경 / 기후": {
      "진보": "환경 보호를 최우선으로 고려",
      "중도-진보": "환경 보호와 경제의 조화 추구",
      "중도": "환경 보호와 경제성 모두 고려",
      "중도-보수": "경제성 우선하되 환경 문제 인식",
      "보수": "경제 성장과 현실적 에너지 정책 중시",
    },
  };

  return descriptions[category]?.[tendency] || "분석 중";
}
