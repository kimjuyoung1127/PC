import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Share2, MessageCircle, Twitter, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result?: {
    politicalLabel: string;
    politicalScore: number;
  };
}

export default function ShareModal({ isOpen, onClose, result }: ShareModalProps) {
  const { toast } = useToast();

  const shareText = result 
    ? `저는 정치 성향 밸런스 게임에서 '${result.politicalLabel}' 성향으로 나왔어요! 여러분도 해보세요 👉`
    : "정치 성향 밸런스 게임 결과를 확인해보세요!";

  const handleShareKakao = () => {
    // Note: In a real app, you would integrate with Kakao SDK
    toast({
      title: "카카오톡 공유",
      description: "카카오톡 SDK 연동이 필요합니다.",
    });
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(shareText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "링크 복사 완료",
        description: "클립보드에 링크가 복사되었습니다.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <Share2 className="w-6 h-6 text-success mx-auto mb-2" />
            결과 공유하기
          </DialogTitle>
          <p className="text-center text-gray-600 text-sm">당신의 정치 성향을 친구들과 공유해보세요</p>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            onClick={handleShareKakao}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            카카오톡으로 공유
          </Button>
          <Button
            onClick={handleShareTwitter}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white"
          >
            <Twitter className="w-4 h-4 mr-2" />
            트위터로 공유
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full"
          >
            <Link className="w-4 h-4 mr-2" />
            링크 복사
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={onClose}
          className="w-full mt-4"
        >
          닫기
        </Button>
      </DialogContent>
    </Dialog>
  );
}
