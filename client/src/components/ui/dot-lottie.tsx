import { DotLottieReact, DotLottie as DotLottieInstance } from "@lottiefiles/dotlottie-react";
import { useState, useEffect, useRef } from "react";

export interface DotLottieProps {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  className?: string;
  width?: number | string;
  height?: number | string;
  onReady?: (dotLottie: DotLottieInstance) => void;
  onError?: () => void;
  fallback?: React.ReactNode;
  testId?: string;
}

export function DotLottie({
  src,
  loop = true,
  autoplay = true,
  speed = 1,
  className,
  width,
  height,
  onReady,
  onError,
  fallback,
  testId = "dot-lottie-animation",
}: DotLottieProps) {
  const [hasError, setHasError] = useState(false);
  const dotLottieRef = useRef<DotLottieInstance | null>(null);
  const currentSrcRef = useRef<string>(src);

  useEffect(() => {
    if (src !== currentSrcRef.current) {
      currentSrcRef.current = src;
      setHasError(false);
      if (dotLottieRef.current) {
        dotLottieRef.current.destroy();
        dotLottieRef.current = null;
      }
    }
  }, [src]);

  useEffect(() => {
    return () => {
      if (dotLottieRef.current) {
        dotLottieRef.current.destroy();
      }
    };
  }, []);

  const handleDotLottieRef = (dotLottie: DotLottieInstance | null) => {
    if (dotLottie && dotLottie !== dotLottieRef.current) {
      dotLottieRef.current = dotLottie;
      
      dotLottie.addEventListener("load", () => {
        onReady?.(dotLottie);
      });
      
      dotLottie.addEventListener("loadError", () => {
        setHasError(true);
        onError?.();
      });
    }
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div 
      className={className}
      style={{ width: width || "100%", height: height || "100%" }}
      data-testid="dot-lottie-container"
    >
      <DotLottieReact
        key={src}
        src={src}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
        style={{ width: "100%", height: "100%" }}
        dotLottieRefCallback={handleDotLottieRef}
        data-testid={testId}
      />
    </div>
  );
}

export const LOTTIE_PRESETS = {
  loading: {
    spinner: "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189571e1bc9d/7Czfx8OMqu.lottie",
    dots: "https://lottie.host/65f22d4e-7df7-4e15-9a5b-45f67e40f18a/bSOPpfWIUn.lottie",
    bars: "https://lottie.host/a0fd3b44-c86e-4e5c-86f8-0cab6e9f17bc/rDeBnbUYiX.lottie",
  },
  success: {
    check: "https://lottie.host/8c8c8caa-70b8-49ac-a2d2-ecb79e85af00/qk8pXhDJMb.lottie",
    celebrate: "https://lottie.host/e9dc4c98-0a11-4476-8cfe-8f08ef4a2d29/sSCzLaGNCs.lottie",
  },
  error: {
    cross: "https://lottie.host/e3d43fae-d5cf-4b86-a2a5-c9b3a9f6c6f0/AzHZK7QBMa.lottie",
    warning: "https://lottie.host/2cdd7a8e-b7a4-4a60-82aa-b1b8f39f3f0a/pVbLGFSNUY.lottie",
  },
  icons: {
    email: "https://lottie.host/d05bc2a9-6ef0-4f22-9bcc-29d178a5fa47/MmPCJhv9e5.lottie",
    phone: "https://lottie.host/1b8b9c41-0c9e-4d1f-9e6a-2f0c0e2e6b2a/nKvTz2F8M3.lottie",
    location: "https://lottie.host/3e8b1c05-e4a7-4c3b-b4a1-5f6c8d9e0a1b/kLmNoPqRsT.lottie",
    settings: "https://lottie.host/7e7b1c3d-3c3e-4d4f-a5a6-6f7c8d9e0a1b/uVwXyZ1A2B.lottie",
    star: "https://lottie.host/ae6c1e05-b4d7-4f9a-82c3-7a8b9c0d1e2f/gHiJkLmNoP.lottie",
    heart: "https://lottie.host/f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d/qRsTuVwXyZ.lottie",
    rocket: "https://lottie.host/a1b2c3d4-e5f6-7890-abcd-ef1234567890/abc123def456.lottie",
    chart: "https://lottie.host/b2c3d4e5-f6a7-8901-bcde-f23456789012/bcd234efg567.lottie",
  },
  ui: {
    menu: "https://lottie.host/c3d4e5f6-a7b8-9012-cdef-345678901234/cde345fgh678.lottie",
    arrow: "https://lottie.host/d4e5f6a7-b8c9-0123-def0-456789012345/def456ghi789.lottie",
    play: "https://lottie.host/e5f6a7b8-c9d0-1234-ef01-567890123456/efg567hij890.lottie",
    pause: "https://lottie.host/f6a7b8c9-d0e1-2345-f012-678901234567/fgh678ijk901.lottie",
  },
} as const;

export function LoadingAnimation({ 
  variant = "spinner",
  size = 48,
  className,
}: { 
  variant?: keyof typeof LOTTIE_PRESETS.loading;
  size?: number;
  className?: string;
}) {
  return (
    <DotLottie
      src={LOTTIE_PRESETS.loading[variant]}
      width={size}
      height={size}
      className={className}
    />
  );
}

export function SuccessAnimation({ 
  variant = "check",
  size = 64,
  loop = false,
  className,
}: { 
  variant?: keyof typeof LOTTIE_PRESETS.success;
  size?: number;
  loop?: boolean;
  className?: string;
}) {
  return (
    <DotLottie
      src={LOTTIE_PRESETS.success[variant]}
      width={size}
      height={size}
      loop={loop}
      className={className}
    />
  );
}

export function ErrorAnimation({ 
  variant = "cross",
  size = 64,
  loop = false,
  className,
}: { 
  variant?: keyof typeof LOTTIE_PRESETS.error;
  size?: number;
  loop?: boolean;
  className?: string;
}) {
  return (
    <DotLottie
      src={LOTTIE_PRESETS.error[variant]}
      width={size}
      height={size}
      loop={loop}
      className={className}
    />
  );
}

export function AnimatedIcon({ 
  icon,
  size = 32,
  loop = true,
  className,
}: { 
  icon: keyof typeof LOTTIE_PRESETS.icons;
  size?: number;
  loop?: boolean;
  className?: string;
}) {
  return (
    <DotLottie
      src={LOTTIE_PRESETS.icons[icon]}
      width={size}
      height={size}
      loop={loop}
      className={className}
    />
  );
}

export default DotLottie;
