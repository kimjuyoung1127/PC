import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Brain, Share2, RotateCcw, Download, Shield } from "lucide-react";
import ShareModal from "@/components/share-modal";
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult, CategoryScore } from "@/types/quiz";

export default function ResultsPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/results/:sessionId");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();

  // Query to fetch result by session ID (for shared links)
  const { data: fetchedResult } = useQuery({
    queryKey: ["/api/result/" + params?.sessionId],
    enabled: !!params?.sessionId,
  });

  useEffect(() => {
    if (fetchedResult) {
      setResult(fetchedResult);
    } else {
      // Try to get result from sessionStorage
      const storedResult = sessionStorage.getItem("analysisResult");
      if (storedResult) {
        try {
          setResult(JSON.parse(storedResult));
        } catch (error) {
          console.error("Failed to parse stored result:", error);
          setLocation("/");
        }
      } else if (!params?.sessionId) {
        // No result available and no session ID in URL
        setLocation("/");
      }
    }
  }, [fetchedResult, params?.sessionId, setLocation]);

  const handleRetakeQuiz = () => {
    // Clear stored data
    sessionStorage.removeItem("answers");
    sessionStorage.removeItem("demographics");
    sessionStorage.removeItem("analysisResult");
    setLocation("/");
  };

  const handleDownloadReport = () => {
    if (!result) return;
    
    // Create a simple text report
    const reportText = `
정치 성향 분석 결과

성향: ${result.politicalLabel}
점수: ${result.politicalScore}/100

AI 분석:
${result.aiAnalysis}

분야별 분석:
${Object.values(result.categoryScores).map(category => 
  `${category.name}: ${category.tendency} (${category.score}%) - ${category.description}`
).join('\n')}

분석 일시: ${new Date().toLocaleString('ko-KR')}
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `정치성향_분석결과_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "다운로드 완료",
      description: "분석 결과가 텍스트 파일로 저장되었습니다.",
    });
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const getPositionPercentage = (score: number) => {
    return score; // score is already 0-100
  };

  const getResultColor = (label: string) => {
    switch (label) {
      case "진보": return "text-red-600";
      case "중도-진보": return "text-orange-600";
      case "중도": return "text-yellow-600";
      case "중도-보수": return "text-blue-600";
      case "보수": return "text-indigo-600";
      default: return "text-gray-600";
    }
  };

  const getCategoryColor = (tendency: string) => {
    switch (tendency) {
      case "진보": return "bg-red-500";
      case "중도-진보": return "bg-orange-500";
      case "중도": return "bg-yellow-500";
      case "중도-보수": return "bg-blue-500";
      case "보수": return "bg-indigo-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryBadgeColor = (tendency: string) => {
    switch (tendency) {
      case "진보": return "bg-red-100 text-red-600";
      case "중도-진보": return "bg-orange-100 text-orange-600";
      case "중도": return "bg-yellow-100 text-yellow-600";
      case "중도-보수": return "bg-blue-100 text-blue-600";
      case "보수": return "bg-indigo-100 text-indigo-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <Card className="shadow-xl mb-6">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4">
                <PieChart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">당신의 정치 성향</h2>
              <p className="text-gray-600">AI 분석 결과를 확인해보세요</p>
            </div>

            {/* Political Spectrum Visualization */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-full max-w-md h-12 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full relative">
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border-4 border-gray-800 rounded-full shadow-lg"
                    style={{ left: `${getPositionPercentage(result.politicalScore)}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 max-w-md mx-auto">
                <span>진보</span>
                <span>중도</span>
                <span>보수</span>
              </div>
            </div>

            {/* Result Label */}
            <div className={`inline-block px-6 py-3 bg-blue-100 font-bold text-lg rounded-full ${getResultColor(result.politicalLabel)}`}>
              {result.politicalLabel} 성향
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card className="shadow-xl mb-6">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Brain className="w-6 h-6 text-purple mr-3" />
              <h3 className="text-xl font-bold text-gray-900">AI 분석 리포트</h3>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple p-6 rounded-r-lg">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {result.aiAnalysis}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <Card className="shadow-xl mb-6">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">분야별 성향 분석</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {Object.values(result.categoryScores).map((category: CategoryScore, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryBadgeColor(category.tendency)}`}>
                      {category.tendency}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${getCategoryColor(category.tendency)}`}
                      style={{ width: `${category.score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            onClick={() => setShowShareModal(true)}
            className="bg-success hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl"
          >
            <Share2 className="w-4 h-4 mr-2" />
            결과 공유하기
          </Button>
          <Button
            onClick={handleRetakeQuiz}
            variant="outline"
            className="font-semibold py-4 px-6 rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            다시 해보기
          </Button>
          <Button
            onClick={handleDownloadReport}
            className="bg-purple hover:bg-purple-600 text-white font-semibold py-4 px-6 rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            리포트 저장
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-yellow-600 mr-3 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">개인정보 보호</h4>
              <p className="text-sm text-yellow-700">
                이 결과는 어디에도 저장되지 않으며, 페이지를 새로고침하면 사라집니다. 
                모든 분석은 일회성으로 수행됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        result={{ 
          politicalLabel: result.politicalLabel, 
          politicalScore: result.politicalScore 
        }}
      />
    </div>
  );
}
