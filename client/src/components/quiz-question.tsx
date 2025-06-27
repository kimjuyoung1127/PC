import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale } from "lucide-react";
import type { Question } from "@/types/quiz";

interface QuizQuestionProps {
  question: Question;
  selectedChoice: "left" | "right" | null;
  onChoiceSelect: (choice: "left" | "right") => void;
}

export default function QuizQuestion({ question, selectedChoice, onChoiceSelect }: QuizQuestionProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {question.categoryIcon} {question.category}
          </h3>
          <p className="text-gray-600 text-sm">둘 중 더 동의하는 선택지를 골라주세요</p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => onChoiceSelect("left")}
            className={`w-full p-6 h-auto text-left border-2 transition-all duration-200 ${
              selectedChoice === "left" 
                ? "border-primary bg-blue-50" 
                : "border-gray-200 hover:border-primary hover:bg-blue-50"
            }`}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors duration-200 ${
                selectedChoice === "left" 
                  ? "bg-primary text-white" 
                  : "bg-blue-100 text-primary"
              }`}>
                <span className="text-sm font-semibold">A</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium leading-relaxed">
                  {question.left}
                </p>
              </div>
            </div>
          </Button>

          <div className="text-center py-2">
            <span className="text-2xl text-gray-300">VS</span>
          </div>

          <Button
            variant="outline"
            onClick={() => onChoiceSelect("right")}
            className={`w-full p-6 h-auto text-left border-2 transition-all duration-200 ${
              selectedChoice === "right" 
                ? "border-primary bg-blue-50" 
                : "border-gray-200 hover:border-primary hover:bg-blue-50"
            }`}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors duration-200 ${
                selectedChoice === "right" 
                  ? "bg-primary text-white" 
                  : "bg-blue-100 text-primary"
              }`}>
                <span className="text-sm font-semibold">B</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium leading-relaxed">
                  {question.right}
                </p>
              </div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
