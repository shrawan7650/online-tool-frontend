import { useState, useEffect, useCallback } from "react";
import { Copy, Download, Clock, Shield, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { GoogleAdSlot } from "../components/GoogleAdSlot";
import React from "react";
import { SEOHead } from "../components/SEOHead";
interface ClipboardResponse {
  code: string;
  ttl: number;
  expiresAt: string;
}

interface RetrieveResponse {
  text: string;
  remainingReads: number;
  expiresAt: string;
}

const MAX_CHARS = 50000;
const EXPIRY_OPTIONS = [
  { value: "15m", label: "15 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
];

export function ClipboardPage() {
  const [activeTab, setActiveTab] = useState<"create" | "retrieve">("create");
  const [text, setText] = useState("");
  const [pin, setPin] = useState("");
  const [expiresIn, setExpiresIn] = useState("1h");
  const [retrieveCode, setRetrieveCode] = useState("");
  const [retrievePin, setRetrievePin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showRetrievePin, setShowRetrievePin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdClip, setCreatedClip] = useState<ClipboardResponse | null>(
    null
  );
  const [retrievedText, setRetrievedText] = useState<RetrieveResponse | null>(
    null
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL_PRODUCTION || "http://localhost:8080";

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(text.length > 0 && !createdClip);
  }, [text, createdClip]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleCreate = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!text.trim()) {
        toast.error("Please enter some text");
        return;
      }

      if (text.length > MAX_CHARS) {
        toast.error(
          `Text too long (max ${MAX_CHARS.toLocaleString()} characters)`
        );
        return;
      }

      if (pin && (pin.length !== 4 || !/^\d+$/.test(pin))) {
        toast.error("PIN must be exactly 4 digits");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post<ClipboardResponse>(
          `${apiBaseUrl}/api/clipboard`,
          {
            text,
            pin: pin || undefined,
            expiresIn,
          }
        );

        setCreatedClip(response.data);
        setHasUnsavedChanges(false);
        toast.success("Clipboard note created successfully!");
      } catch (error) {
        toast.error(
          error.response?.data?.error?.message ||
            "Failed to create clipboard note"
        );
      } finally {
        setLoading(false);
      }
    },
    [text, pin, expiresIn, apiBaseUrl]
  );

  const handleRetrieve = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!retrieveCode.trim()) {
        toast.error("Please enter a code");
        return;
      }

      if (!/^\d{6}$/.test(retrieveCode)) {
        toast.error("Code must be exactly 6 digits");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post<RetrieveResponse>(
          `${apiBaseUrl}/api/clipboard/retrieve`,
          {
            code: retrieveCode,
            pin: retrievePin || undefined,
          }
        );

        setRetrievedText(response.data);
        toast.success("Clipboard note retrieved successfully!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.message ||
          "Failed to retrieve clipboard note";
        if (error.response?.status === 404) {
          toast.error("Code not found or expired");
        } else if (error.response?.status === 401) {
          toast.error("Incorrect PIN");
        } else {
          toast.error(errorMessage);
        }
        setRetrievedText(null);
      } finally {
        setLoading(false);
      }
    },
    [retrieveCode, retrievePin, apiBaseUrl]
  );

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = (text: string, filename = "clipboard-note.txt") => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded successfully");
  };

  const handleNewNote = () => {
    setText("");
    setPin("");
    setExpiresIn("1h");
    setCreatedClip(null);
    setHasUnsavedChanges(false);
  };

  const formatTimeRemaining = (expiresAt: string): string => {
    const now = new Date().getTime();
    const expires = new Date(expiresAt).getTime();
    const diff = expires - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
      <SEOHead
        title="Secure Online Clipboard - Share Text with Temporary Codes"
        description="Share text securely with temporary 6-digit codes. AES-256 encrypted, auto-expires, PIN protection available. Perfect for sharing sensitive information safely."
        keywords="secure clipboard, online clipboard, text sharing, encrypted sharing, temporary codes, secure text transfer"
        canonicalUrl="/clipboard"
      />
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Secure Online Clipboard
        </h1>
        <p className="text-lg text-slate-400">
          Share text securely with temporary codes. Data is encrypted and
          auto-expires.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="p-1 rounded-lg bg-slate-800">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-3 rounded transition-colors ${
              activeTab === "create"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Note
          </button>
          <button
            onClick={() => setActiveTab("retrieve")}
            className={`px-6 py-3 rounded transition-colors ${
              activeTab === "retrieve"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Retrieve Note
          </button>
        </div>
      </div>

      {activeTab === "create" && (
        <div className="space-y-6">
          {!createdClip ? (
            <div className="tool-card">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Create Secure Note
              </h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label
                    htmlFor="text"
                    className="block mb-2 text-sm font-medium text-slate-300"
                  >
                    Text Content ({text.length.toLocaleString()}/
                    {MAX_CHARS.toLocaleString()})
                  </label>
                  <textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={MAX_CHARS}
                    placeholder="Enter your text here..."
                    className="h-32 textarea-field"
                    aria-describedby="text-help"
                  />
                  <p id="text-help" className="mt-1 text-xs text-slate-500">
                    Your text will be encrypted and stored securely
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="pin"
                      className="block mb-2 text-sm font-medium text-slate-300"
                    >
                      PIN (Optional)
                    </label>
                    <div className="relative">
                      <input
                        id="pin"
                        type={showPin ? "text" : "password"}
                        value={pin}
                        onChange={(e) =>
                          setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        placeholder="4-digit PIN"
                        className="pr-10 input-field"
                        aria-describedby="pin-help"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-white"
                        aria-label={showPin ? "Hide PIN" : "Show PIN"}
                      >
                        {showPin ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p id="pin-help" className="mt-1 text-xs text-slate-500">
                      Add extra security with a 4-digit PIN
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="expiry"
                      className="block mb-2 text-sm font-medium text-slate-300"
                    >
                      Expires After
                    </label>
                    <select
                      id="expiry"
                      value={expiresIn}
                      onChange={(e) => setExpiresIn(e.target.value)}
                      className="input-field"
                    >
                      {EXPIRY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={loading || !text.trim()}
                >
                  {loading ? "Generating..." : "Generate Secure Code"}
                </button>
              </form>
            </div>
          ) : (
            <div className="tool-card">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Note Created Successfully
              </h3>
              <div className="space-y-4">
                <div className="p-4 border-2 rounded-lg bg-slate-900 border-green-500/30">
                  <div className="text-center">
                    <p className="mb-2 text-slate-300">Your secure code is:</p>
                    <div className="mb-2 font-mono text-3xl font-bold text-green-400">
                      {createdClip.code}
                    </div>
                    <button
                      onClick={() => handleCopy(createdClip.code)}
                      className="btn-copy"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimeRemaining(createdClip.expiresAt)}
                  </div>
                  <span>•</span>
                  <span>Max 3 reads</span>
                  {pin && (
                    <>
                      <span>•</span>
                      <span>PIN protected</span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleNewNote}
                  className="w-full btn-secondary"
                >
                  Create Another Note
                </button>
              </div>
            </div>
          )}

          <GoogleAdSlot adSlotId="6789012345" />
        </div>
      )}

      {activeTab === "retrieve" && (
        <div className="space-y-6">
          <div className="tool-card">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Retrieve Note
            </h3>
            <form onSubmit={handleRetrieve} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="retrieve-code"
                    className="block mb-2 text-sm font-medium text-slate-300"
                  >
                    6-Digit Code
                  </label>
                  <input
                    id="retrieve-code"
                    type="text"
                    value={retrieveCode}
                    onChange={(e) =>
                      setRetrieveCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    placeholder="000000"
                    className="font-mono text-lg text-center input-field"
                    maxLength={6}
                  />
                </div>

                <div>
                  <label
                    htmlFor="retrieve-pin"
                    className="block mb-2 text-sm font-medium text-slate-300"
                  >
                    PIN (If Set)
                  </label>
                  <div className="relative">
                    <input
                      id="retrieve-pin"
                      type={showRetrievePin ? "text" : "password"}
                      value={retrievePin}
                      onChange={(e) =>
                        setRetrievePin(
                          e.target.value.replace(/\D/g, "").slice(0, 4)
                        )
                      }
                      placeholder="Optional 4-digit PIN"
                      className="pr-10 input-field"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRetrievePin(!showRetrievePin)}
                      className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-white"
                      aria-label={showRetrievePin ? "Hide PIN" : "Show PIN"}
                    >
                      {showRetrievePin ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
                disabled={loading || retrieveCode.length !== 6}
              >
                {loading ? "Retrieving..." : "Fetch Note"}
              </button>
            </form>
          </div>

          {retrievedText && (
            <div className="tool-card">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Retrieved Note
              </h3>
              <div className="space-y-4">
                <textarea
                  value={retrievedText.text}
                  readOnly
                  className="h-32 textarea-field bg-slate-900"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleCopy(retrievedText.text)}
                    className="inline-flex items-center space-x-2 btn-copy"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Text</span>
                  </button>
                  <button
                    onClick={() => handleDownload(retrievedText.text)}
                    className="inline-flex items-center space-x-2 btn-secondary"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
                  <span>{retrievedText.remainingReads} reads left</span>
                  <span>•</span>
                  <span>{formatTimeRemaining(retrievedText.expiresAt)}</span>
                </div>
              </div>
            </div>
          )}

          <GoogleAdSlot adSlotId="7890123456" />
        </div>
      )}

      {/* Security Info */}
      <div className="mt-8 tool-card">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
          <Shield className="w-5 h-5 mr-2 text-blue-500" />
          Security Features
        </h3>
        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium text-white">
              Encryption & Privacy:
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li>✓ AES-256-GCM encryption</li>
              <li>✓ Server-side encryption at rest</li>
              <li>✓ No logs of content stored</li>
              <li>✓ Automatic expiration</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium text-white">Access Control:</h4>
            <ul className="space-y-1 text-slate-400">
              <li>✓ Limited read attempts (max 3)</li>
              <li>✓ Optional PIN protection</li>
              <li>✓ Rate limiting on retrieval</li>
              <li>✓ Auto-deletion after expiry</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
