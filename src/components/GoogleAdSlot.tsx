import { useEffect, useRef } from 'react';
import React from 'react'; 
interface GoogleAdSlotProps {
  adSlotId: string;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function GoogleAdSlot({ adSlotId, style, className = '' }: GoogleAdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isProduction = import.meta.env.PROD;
  const adsEnabled = (import.meta.env as any).VITE_ENABLE_ADS === 'true'; // Type assertion to bypass TypeScript error

  useEffect(() => {
    if (isProduction && adsEnabled && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [isProduction, adsEnabled]);

  // Don't render ads in development or if disabled
  if (!isProduction || !adsEnabled) {
    return (
      <div className={`bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg p-8 text-center ${className}`}>
        <p className="text-sm text-slate-500">Ad Slot (Development Mode)</p>
        <p className="mt-1 text-xs text-slate-600">{adSlotId}</p>
      </div>
    );
  }

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style
        }}
        data-ad-client={import.meta.env.VITE_GOOGLE_ADS_CLIENT}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}