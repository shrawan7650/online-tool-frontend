import { useState, useCallback } from "react";
import { Copy, ArrowRight, ArrowLeft, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { GoogleAdSlot } from "../components/GoogleAdSlot";
import React from "react";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { SEOHead } from "../components/SEOHead";
export function Base64Page() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlSafe, setUrlSafe] = useState(false);

  const handleProcess = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!input.trim()) {
        toast.error("Please enter some text");
        return;
      }

      try {
        if (mode === "encode") {
          let encoded = btoa(unescape(encodeURIComponent(input)));
          if (urlSafe) {
            encoded = encoded
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=/g, "");
          }
          setResult(encoded);
          toast.success("Text encoded successfully");
        } else {
          let toDecode = input;
          if (urlSafe) {
            toDecode = toDecode.replace(/-/g, "+").replace(/_/g, "/");
            // Add padding if needed
            while (toDecode.length % 4) {
              toDecode += "=";
            }
          }
          const decoded = decodeURIComponent(escape(atob(toDecode)));
          setResult(decoded);
          toast.success("Text decoded successfully");
        }
      } catch (error) {
        toast.error("Invalid Base64 input");
        setResult("");
      }
    },
    [input, mode, urlSafe],
  );

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleProcess();
    }
  };

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
          <SEOHead
        title="Base64 Encode/Decode Tool - Online Base64 Converter"
        description="Free Base64 encoder and decoder with URL-safe option. Convert text to Base64 encoding or decode Base64 strings back to readable text. Supports Unicode."
        keywords="Base64 encode, Base64 decode, Base64 converter, URL safe Base64, online encoder, text converter"
        canonicalUrl="/base64"
      />
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Base64 Encode/Decode
        </h1>
        <p className="text-lg text-slate-400">
          Convert text to Base64 encoding or decode Base64 strings back to
          readable text
        </p>
      </div>

      {/* Mode Toggle & Options */}
      <div className="flex flex-col items-center justify-center gap-4 mb-6 sm:flex-row">
        <div className="p-1 rounded-lg bg-slate-800">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded transition-colors ${
              mode === "encode"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded transition-colors ${
              mode === "decode"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Decode
          </button>
        </div>

        <label className="flex items-center space-x-2 text-slate-300">
        <ToggleSwitch 
  label="URL Safe" 
  checked={urlSafe} 
  onChange={setUrlSafe} 
/>
          <span>URL Safe</span>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        {/* Input Section */}
        <div className="tool-card">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
            Input Text
            {mode === "encode" ? (
              <ArrowRight className="w-5 h-5 ml-2 text-emerald-500" />
            ) : (
              <ArrowLeft className="w-5 h-5 ml-2 text-emerald-500" />
            )}
          </h3>
          <form onSubmit={handleProcess} className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                mode === "encode"
                  ? "Enter text to encode (supports Unicode)"
                  : "Enter Base64 encoded text"
              }
              className="h-32 textarea-field"
              aria-label={`Text to ${mode}`}
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="btn-primary"
                disabled={!input.trim()}
              >
                {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
              </button>
              <button
                type="button"
                onClick={() => setInput("")}
                className="btn-secondary"
                disabled={!input}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Result Section */}
        <div className="tool-card">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
            <FileText className="w-5 h-5 mr-2 text-emerald-500" />
            Result
          </h3>
          {result ? (
            <div className="space-y-4">
              <textarea
                value={result}
                readOnly
                className="h-32 font-mono text-sm textarea-field bg-slate-900"
                aria-label="Encoded/decoded result"
              />
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleCopy(result)}
                  className="inline-flex items-center space-x-2 btn-copy"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Result</span>
                </button>
                <span className="text-sm text-slate-500">
                  {result.length} characters
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg bg-slate-900 border-slate-700">
              <p className="text-slate-500">Result will appear here</p>
            </div>
          )}
        </div>
      </div>

      <GoogleAdSlot adSlotId="3456789012" />

      {/* Info Section */}
      <div className="mt-8 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">
          About Base64 Encoding
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="mb-4 text-slate-400">
            Base64 is a binary-to-text encoding scheme that represents binary
            data in ASCII format by translating it into a base-64
            representation. It's commonly used for encoding binary data in
            contexts where only text is allowed.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-white">Standard Base64:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>Uses A-Z, a-z, 0-9, +, /</li>
                <li>Uses = for padding</li>
                <li>76 characters per line (MIME)</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-white">URL-Safe Base64:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>Replaces + with - and / with _</li>
                <li>Removes padding (=)</li>
                <li>Safe for URLs and filenames</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="mb-2 font-medium text-white">Common Use Cases:</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>Email attachments (MIME)</li>
              <li>Data URLs in web pages</li>
              <li>JWT tokens</li>
              <li>API authentication tokens</li>
              <li>Storing binary data in JSON/XML</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
