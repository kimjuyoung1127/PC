import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Clock, Brain, CheckCircle, ShieldX, Share2 } from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const handleStartGame = () => {
    setLocation("/demographic");
  };

  return (
    <div className="min-h-screen bg-gradient-landing flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardContent className="pt-8 pb-8 px-8 text-center">
          <div className="mb-6">
            <Scale className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">정치 성향 밸런스 게임</h1>
            <p className="text-gray-600 text-sm leading-relaxed">AI가 분석하는 나의 정치적 성향</p>
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-700">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                <span>5분 소요</span>
              </div>
              <div className="flex items-center">
                <Brain className="w-4 h-4 mr-2 text-purple" />
                <span>AI 해석</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-5 h-5 text-success mr-3" />
              <span>12개의 밸런스 질문</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <ShieldX className="w-5 h-5 text-success mr-3" />
              <span>개인정보 수집 없음</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Share2 className="w-5 h-5 text-success mr-3" />
              <span>결과 공유 가능</span>
            </div>
          </div>

          <Button 
            onClick={handleStartGame}
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg mb-4"
          >
            게임 시작하기
          </Button>
          
          <p className="text-xs text-gray-500 leading-relaxed">
            모든 데이터는 저장되지 않으며 일회성 분석에만 사용됩니다
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
