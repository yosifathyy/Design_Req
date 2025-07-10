
import { useRef, useCallback, useState } from 'react';
import { LottieRefCurrentProps } from 'lottie-react';

interface UseLottieAnimationReturn {
  lottieRef: React.RefObject<LottieRefCurrentProps>;
  isAnimationComplete: boolean;
  isLottieVisible: boolean;
  playAnimation: () => void;
  stopAnimation: () => void;
  resetAnimation: () => void;
  setLottieVisible: (visible: boolean) => void;
}

export const useLottieAnimation = (): UseLottieAnimationReturn => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isLottieVisible, setIsLottieVisible] = useState(true);

  const playAnimation = useCallback(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
      setIsLottieVisible(true);
    }
  }, []);

  const stopAnimation = useCallback(() => {
    if (lottieRef.current) {
      lottieRef.current.stop();
    }
  }, []);

  const resetAnimation = useCallback(() => {
    if (lottieRef.current) {
      lottieRef.current.goToAndStop(0);
      setIsAnimationComplete(false);
      setIsLottieVisible(true);
    }
  }, []);

  const setLottieVisible = useCallback((visible: boolean) => {
    setIsLottieVisible(visible);
  }, []);

  return {
    lottieRef,
    isAnimationComplete,
    isLottieVisible,
    playAnimation,
    stopAnimation,
    resetAnimation,
    setLottieVisible,
  };
};
