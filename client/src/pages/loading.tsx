import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Brain, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Answer, Demographics, AnalysisResult } from "@/types/quiz";

export default function LoadingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (data: { answers: Answer[], demographics?: Demographics }) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json();
    },
    onSuccess: (result: AnalysisResult) => {
      // Store result in sessionStorage
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      setLocation("/results");
    },
    onError: (error: Error) => {
      console.error("Analysis failed:", error);
      toast({
        title: "분석 실패",
        description: "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
      // Redirect back to quiz or landing
      setLocation("/");
    },
  });

  useEffect(() => {
    // Get data from sessionStorage
    const answersData = sessionStorage.getItem("answers");
    const demographicsData = sessionStorage.getItem("demographics");

    if (!answersData) {
      setLocation("/");
      return;
    }

    try {
      const answers: Answer[] = JSON.parse(answersData);
      const demographics: Demographics = demographicsData ? JSON.parse(demographicsData) : {};

      // Start analysis
      analyzeMutation.mutate({ answers, demographics });
    } catch (error) {
      console.error("Failed to parse stored data:", error);
      setLocation("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardContent className="pt-8 pb-8 px-8 text-center">
          <div className="mb-6">
            <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI가 분석 중입니다</h3>
            <p className="text-gray-600 text-sm">잠시만 기다려주세요...</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center space-x-2 text-success">
              <CheckCircle className="w-4 h-4" />
              <span>응답 데이터 수집 완료</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Brain className="w-4 h-4" />
              <span>AI 성향 분석 진행 중...</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <FileText className="w-4 h-4" />
              <span>결과 리포트 생성 대기</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              AI가 당신의 정치적 성향을 종합적으로 분석하고 있습니다
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
