import { GoogleGenerativeAI } from "@google/generative-ai";
import type { QuizAnswer, Demographics, CategoryScore } from "@shared/schema";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || "");

export async function analyzePoliticalOrientation(
  answers: QuizAnswer[],
  demographics?: Demographics,
  politicalScore?: number,
  politicalLabel?: string,
  categoryScores?: Record<string, CategoryScore>
): Promise<string> {
  try {
    // Build context about the user's responses
    const answersContext = answers.map(answer => {
      const choice = answer.choice === "left" ? "A" : "B";
      return `질문 ${answer.questionId}: ${choice}번 선택 (점수: ${answer.choice === "left" ? answer.leftScore : answer.rightScore})`;
    }).join('\n');

    const demographicsContext = demographics ? `
사용자 정보:
- 연령대: ${demographics.age || '미제공'}
- 성별: ${demographics.gender || '미제공'}  
- 거주지역: ${demographics.region || '미제공'}
` : '사용자 정보: 미제공';

    const categoryContext = categoryScores ? Object.values(categoryScores).map(cat => 
      `${cat.name}: ${cat.tendency} (${cat.score}점)`
    ).join('\n') : '';

    const systemPrompt = `당신은 한국 정치 성향을 분석하는 전문가입니다. 
사용자의 밸런스 게임 응답을 바탕으로 정치적 성향을 분석하고, 한국어로 상세하고 개인화된 해석을 제공해주세요.

분석 기준:
- 진보(-2~-1점): 복지 확대, 사회적 평등, 환경 보호, 대화 외교 선호
- 중도(-1~1점): 균형잡힌 접근, 실용적 정책 선호
- 보수(1~2점): 시장 경제, 개인 책임, 전통 가치, 강한 안보 선호

분석 결과는 다음 요소를 포함해야 합니다:
1. 전반적인 정치 성향 특징 (2-3문장)
2. 주요 분야별 성향 분석 (경제, 사회, 안보 등)
3. 해당 성향의 특징과 가치관
4. 정치적 의사결정 패턴

한국 사회의 맥락을 고려하여 분석하고, 편견없이 균형잡힌 시각으로 작성해주세요.
분석은 3-4개 문단으로 구성하고, 각 문단은 2-3문장으로 작성해주세요.`;

    const userPrompt = `다음 사용자의 정치 성향 밸런스 게임 결과를 분석해주세요:

${demographicsContext}

응답 내역:
${answersContext}

전체 정치 점수: ${politicalScore}점 (${politicalLabel})

분야별 점수:
${categoryContext}

위 정보를 바탕으로 이 사용자의 정치적 성향을 종합적으로 분석하고 해석해주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
      contents: userPrompt,
    });

    const analysis = response.text;
    
    if (!analysis) {
      throw new Error("AI 분석 결과가 비어있습니다");
    }

    return analysis;

  } catch (error) {
    console.error("Gemini API 오류:", error);
    
    // Fallback analysis based on score
    return generateFallbackAnalysis(politicalScore || 50, politicalLabel || "중도", categoryScores);
  }
}

function generateFallbackAnalysis(
  score: number, 
  label: string, 
  categoryScores?: Record<string, CategoryScore>
): string {
  const baseAnalysis = {
    "진보": `당신은 **진보적 성향**을 보이고 있습니다. 사회적 평등과 복지 확대를 중시하며, 환경 보호와 인권 문제에 대해 적극적인 자세를 보입니다.

경제적으로는 국가의 역할을 중요하게 생각하고, 시장 실패를 보완하는 정책을 지지하는 경향이 있습니다. 사회 문제에 대해서는 개방적이고 포용적인 접근을 선호합니다.

외교와 안보에서는 대화와 협력을 통한 평화적 해결을 우선시하며, 군사적 대응보다는 외교적 노력을 중시하는 모습을 보입니다.

전반적으로 사회 변화에 적극적이고, 기존 제도의 개선을 통해 더 나은 사회를 만들어가려는 의지가 강한 성향입니다.`,

    "중도-진보": `당신은 **중도-진보 성향**을 보이고 있습니다. 진보적 가치를 추구하면서도 현실적 제약을 고려하는 균형잡힌 접근을 선호합니다.

복지와 사회 안전망의 필요성을 인정하면서도, 경제 성장과의 조화를 중시합니다. 사회 변화에 대해서는 점진적이고 안정적인 발전을 추구하는 경향을 보입니다.

안보와 외교 분야에서는 평화적 해결을 선호하되, 현실적 안보 위협에 대한 대비도 필요하다고 생각합니다.

실용적이고 합리적인 정책 판단을 중시하며, 이념보다는 효과적인 문제 해결에 초점을 맞추는 성향을 보입니다.`,

    "중도": `당신은 **중도 성향**을 보이고 있습니다. 좌우 어느 한쪽에 치우치지 않고 균형잡힌 관점으로 정치적 이슈를 바라보는 특징을 보입니다.

경제 정책에서는 시장 경제의 효율성을 인정하면서도 필요한 곳에는 정부의 개입이 필요하다고 생각합니다. 복지와 성장, 효율성과 형평성 사이의 균형을 추구합니다.

사회 문제에 대해서는 전통적 가치와 새로운 변화 모두를 고려하며, 급진적 변화보다는 점진적 개선을 선호하는 경향을 보입니다.

정치적 의사결정에서는 이념보다는 실용성과 효과를 중시하며, 상황과 맥락에 따라 유연한 판단을 하는 성향을 가지고 있습니다.`,

    "중도-보수": `당신은 **중도-보수 성향**을 보이고 있습니다. 보수적 가치를 기본으로 하면서도 필요에 따라 개혁과 변화를 수용하는 유연성을 보입니다.

경제적으로는 시장 경제와 자유 경쟁을 선호하지만, 사회적 안전망의 필요성도 어느 정도 인정합니다. 개인의 책임과 노력을 중시하면서도 사회적 배려가 필요한 부분을 인식합니다.

전통적 가치와 질서를 중시하면서도, 시대적 변화에 맞는 점진적 개선은 필요하다고 생각합니다.

안보와 외교에서는 확고한 대비를 중시하되, 대화와 협상의 여지도 열어두는 신중한 접근을 선호하는 경향을 보입니다.`,

    "보수": `당신은 **보수적 성향**을 보이고 있습니다. 전통적 가치와 기존 질서를 중시하며, 안정적이고 점진적인 발전을 추구하는 특징을 보입니다.

경제적으로는 자유시장 경제를 강하게 지지하며, 개인의 책임과 자율을 중시합니다. 정부의 시장 개입은 최소화하고, 기업의 자유로운 경제활동을 통한 성장을 선호합니다.

사회적으로는 전통적 가치와 질서를 중시하며, 급격한 사회 변화보다는 안정적인 발전을 추구합니다. 법과 질서, 사회적 규범의 중요성을 강조합니다.

안보와 외교에서는 확고한 안보 태세와 동맹 관계를 중시하며, 국가의 안전과 이익을 최우선으로 고려하는 현실주의적 접근을 선호합니다.`
  };

  return baseAnalysis[label as keyof typeof baseAnalysis] || baseAnalysis["중도"];
}
