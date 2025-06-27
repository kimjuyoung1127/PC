import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import QuizQuestion from "@/components/quiz-question";
import { questions } from "@/lib/questions";
import type { Answer } from "@/types/quiz";

export default function QuizPage() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    // Reset selected choice when question changes
    setSelectedChoice(null);
    
    // Load existing answer if available
    const existingAnswer = answers.find(a => a.questionId === questions[currentQuestion].id);
    if (existingAnswer) {
      setSelectedChoice(existingAnswer.choice);
    }
  }, [currentQuestion, answers]);

  const handleChoiceSelect = (choice: "left" | "right") => {
    setSelectedChoice(choice);
    
    const question = questions[currentQuestion];
    const answer: Answer = {
      questionId: question.id,
      choice,
      leftScore: question.leftScore,
      rightScore: question.rightScore,
    };

    // Update answers array
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== question.id);
      return [...filtered, answer];
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz completed
      sessionStorage.setItem("answers", JSON.stringify(answers));
      setLocation("/loading");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleExit = () => {
    if (confirm("정말로 나가시겠습니까? 진행 상황이 저장되지 않습니다.")) {
      setLocation("/");
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              질문 {currentQuestion + 1}/{questions.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-2xl mx-auto p-4 pt-8">
        <QuizQuestion
          question={questions[currentQuestion]}
          selectedChoice={selectedChoice}
          onChoiceSelect={handleChoiceSelect}
        />

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            이전
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedChoice === null}
            className="px-6 py-3 bg-primary hover:bg-blue-600"
          >
            {currentQuestion === questions.length - 1 ? "완료" : "다음"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
