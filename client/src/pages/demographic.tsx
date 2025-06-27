import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserCircle } from "lucide-react";
import type { Demographics } from "@/types/quiz";

export default function DemographicPage() {
  const [, setLocation] = useLocation();
  const [demographics, setDemographics] = useState<Demographics>({});

  const handleSkip = () => {
    // Store empty demographics in sessionStorage
    sessionStorage.setItem("demographics", JSON.stringify({}));
    setLocation("/quiz");
  };

  const handleProceed = () => {
    // Store demographics in sessionStorage
    sessionStorage.setItem("demographics", JSON.stringify(demographics));
    setLocation("/quiz");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="text-center mb-6">
            <UserCircle className="w-16 h-16 text-purple mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">추가 정보 (선택사항)</h2>
            <p className="text-gray-600 text-sm">더 정확한 분석을 위한 정보입니다. 입력하지 않아도 진행 가능합니다.</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">연령대</Label>
              <Select value={demographics.age || ""} onValueChange={(value) => setDemographics(prev => ({ ...prev, age: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="선택하지 않음" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">선택하지 않음</SelectItem>
                  <SelectItem value="10s">10대</SelectItem>
                  <SelectItem value="20s">20대</SelectItem>
                  <SelectItem value="30s">30대</SelectItem>
                  <SelectItem value="40s">40대</SelectItem>
                  <SelectItem value="50s">50대</SelectItem>
                  <SelectItem value="60s">60대 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">성별</Label>
              <Select value={demographics.gender || ""} onValueChange={(value) => setDemographics(prev => ({ ...prev, gender: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="선택하지 않음" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">선택하지 않음</SelectItem>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">거주 지역</Label>
              <Select value={demographics.region || ""} onValueChange={(value) => setDemographics(prev => ({ ...prev, region: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="선택하지 않음" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">선택하지 않음</SelectItem>
                  <SelectItem value="seoul">서울</SelectItem>
                  <SelectItem value="busan">부산</SelectItem>
                  <SelectItem value="daegu">대구</SelectItem>
                  <SelectItem value="incheon">인천</SelectItem>
                  <SelectItem value="gwangju">광주</SelectItem>
                  <SelectItem value="daejeon">대전</SelectItem>
                  <SelectItem value="ulsan">울산</SelectItem>
                  <SelectItem value="gyeonggi">경기</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1"
            >
              건너뛰기
            </Button>
            <Button
              onClick={handleProceed}
              className="flex-1 bg-primary hover:bg-blue-600"
            >
              다음
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
