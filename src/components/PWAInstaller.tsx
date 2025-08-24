import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('PWA installation accepted');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 animate-slide-up">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-white">Install App</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white"
            aria-label="Dismiss install prompt"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Install Online Tools for quick access and offline functionality.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={handleInstall}
            className="btn-primary text-sm flex-1"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="btn-secondary text-sm"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}