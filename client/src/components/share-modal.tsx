import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Share2, MessageCircle, Twitter, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Kakao: any;
  }
}

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
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      // Initialize with a demo app key - for real deployment, you would need to register your app
      try {
        window.Kakao.init('demo');
        setKakaoReady(true);
      } catch (error) {
        console.log('Kakao initialization failed:', error);
      }
    } else if (window.Kakao && window.Kakao.isInitialized()) {
      setKakaoReady(true);
    }
  }, []);

  const shareText = result 
    ? `저는 정치 성향 밸런스 게임에서 '${result.politicalLabel}' 성향으로 나왔어요! 여러분도 해보세요 👉`
    : "정치 성향 밸런스 게임 결과를 확인해보세요!";

  const handleShareKakao = () => {
    if (!kakaoReady || !window.Kakao) {
      toast({
        title: "카카오톡 공유 불가",
        description: "카카오톡 SDK가 로드되지 않았습니다. 페이지를 새로고침해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '정치 성향 밸런스 게임',
          description: shareText,
          imageUrl: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=300&fit=crop',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '나도 해보기',
            link: {
              mobileWebUrl: window.location.origin,
              webUrl: window.location.origin,
            },
          },
        ],
      });
    } catch (error) {
      console.error('Kakao share error:', error);
      toast({
        title: "공유 실패",
        description: "카카오톡 공유 중 오류가 발생했습니다. 다른 방법을 이용해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(shareText);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '정치 성향 밸런스 게임',
          text: shareText,
          url: window.location.href,
        });
        onClose();
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "공유 실패",
            description: "공유 중 오류가 발생했습니다.",
            variant: "destructive",
          });
        }
      }
    } else {
      handleCopyLink();
    }
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
            disabled={!kakaoReady}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 disabled:bg-gray-300 disabled:text-gray-600"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {kakaoReady ? "카카오톡으로 공유" : "카카오톡 로딩 중..."}
          </Button>
          <Button
            onClick={handleShareTwitter}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white"
          >
            <Twitter className="w-4 h-4 mr-2" />
            트위터로 공유
          </Button>
          {navigator.share ? (
            <Button
              onClick={handleNativeShare}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              앱으로 공유하기
            </Button>
          ) : null}
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
