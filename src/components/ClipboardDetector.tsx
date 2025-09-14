import React, { useState, useEffect } from "react";
import { Clipboard, X, Check } from "lucide-react";
import toast from "react-hot-toast";

export function ClipboardDetector() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [clipboardText, setClipboardText] = useState("");

  useEffect(() => {
    const checkClipboard = async () => {
      try {
        // Only check if we have permission and the API is available
        if (!navigator.clipboard || !navigator.clipboard.readText) {
          return;
        }

        // Check if we already prompted in this session
        const hasPrompted = sessionStorage.getItem("clipboard-prompted");
        if (hasPrompted) {
          return;
        }

        const text = await navigator.clipboard.readText();
        if (text && text.trim().length > 0 && text.length < 10000) {
          setClipboardText(text);
          setShowPrompt(true);
          sessionStorage.setItem("clipboard-prompted", "true");
        }
      } catch (error) {
        // Silently fail - clipboard access might be denied
        console.debug("Clipboard access not available or denied");
      }
    };

    // Check clipboard after a short delay to avoid blocking initial render
    const timer = setTimeout(checkClipboard, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    // Create a custom event to notify other components
    const event = new CustomEvent("clipboard-paste", {
      detail: { text: clipboardText },
    });
    window.dispatchEvent(event);

    toast.success("Clipboard content ready to use!");
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed z-50 border rounded-lg shadow-xl top-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-slate-900 border-slate-700 animate-slide-up">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Clipboard className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-white">Clipboard Detected</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white"
            aria-label="Dismiss clipboard prompt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="mb-3 text-sm text-slate-400">
          We detected content in your clipboard. Would you like to use it?
        </p>
        <div className="p-2 mb-4 overflow-y-auto rounded bg-slate-800 max-h-20">
          <p className="font-mono text-xs break-all text-slate-300">
            {clipboardText.length > 100
              ? `${clipboardText.substring(0, 100)}...`
              : clipboardText}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAccept}
            className="inline-flex items-center justify-center flex-1 space-x-2 text-sm btn-primary"
          >
            <Check className="w-4 h-4" />
            <span>Use Content</span>
          </button>
          <button onClick={handleDismiss} className="text-sm btn-secondary">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
