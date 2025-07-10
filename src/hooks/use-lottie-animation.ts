
import { useRef, useCallback, useState } from 'react';
import { LottieRefCurrentProps } from 'lottie-react';

interface UseLottieAnimationReturn {
  lottieRef: React.RefObject<LottieRefCurrentProps>;
  isAnimationComplete: boolean;
  playAnimation: () => void;
  stopAnimation: () => void;
  resetAnimation: () => void;
}

export const useLottieAnimation = (): UseLottieAnimationReturn => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const playAnimation = useCallback(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
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
    }
  }, []);

  return {
    lottieRef,
    isAnimationComplete,
    playAnimation,
    stopAnimation,
    resetAnimation,
  };
};
