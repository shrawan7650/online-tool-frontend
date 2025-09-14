import React, { useState, useCallback } from "react";
import { Clock, Calendar, Lock, Copy, Share } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { format, addDays, addHours, addMinutes } from "date-fns";
import { GoogleAdSlot } from "../components/GoogleAdSlot";
import { SEOHead } from "../components/SEOHead";

interface ScheduledItem {
  code: string;
  type: "text" | "file";
  unlockAt: string;
  expiresAt: string;
  title?: string;
}

interface RetrieveResponse {
  content: string;
  type: "text" | "file";
  title?: string;
  filename?: string;
  url?: string;
}

export function SchedulerPage() {
  const [activeTab, setActiveTab] = useState<"create" | "retrieve">("create");
  const [contentType, setContentType] = useState<"text" | "file">("text");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [unlockDateTime, setUnlockDateTime] = useState("");
  const [retrieveCode, setRetrieveCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [scheduledItem, setScheduledItem] = useState<ScheduledItem | null>(
    null,
  );
  const [retrieveResult, setRetrieveResult] = useState<RetrieveResponse | null>(
    null,
  );

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const getMinDateTime = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
    return format(now, "yyyy-MM-dd'T'HH:mm");
  };

  const getMaxDateTime = (): string => {
    const maxDate = addDays(new Date(), 30); // Maximum 30 days from now
    return format(maxDate, "yyyy-MM-dd'T'HH:mm");
  };

  const setQuickTime = (type: "minutes" | "hours" | "days", value: number) => {
    const now = new Date();
    let targetDate: Date;

    switch (type) {
      case "minutes":
        targetDate = addMinutes(now, value);
        break;
      case "hours":
        targetDate = addHours(now, value);
        break;
      case "days":
        targetDate = addDays(now, value);
        break;
    }

    setUnlockDateTime(format(targetDate, "yyyy-MM-dd'T'HH:mm"));
  };

  const handleSchedule = useCallback(async () => {
    if (!content.trim()) {
      toast.error("Please enter content to schedule");
      return;
    }

    if (!unlockDateTime) {
      toast.error("Please select unlock date and time");
      return;
    }

    const unlockDate = new Date(unlockDateTime);
    const now = new Date();

    if (unlockDate <= now) {
      toast.error("Unlock time must be in the future");
      return;
    }

    if (unlockDate > addDays(now, 30)) {
      toast.error("Unlock time cannot be more than 30 days from now");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<ScheduledItem>(
        `${apiBaseUrl}/api/scheduler/create`,
        {
          type: contentType,
          content,
          title: title || undefined,
          unlockAt: unlockDate.toISOString(),
        },
      );

      setScheduledItem(response.data);
      toast.success("Content scheduled successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error?.message || "Failed to schedule content",
      );
    } finally {
      setLoading(false);
    }
  }, [content, title, unlockDateTime, contentType, apiBaseUrl]);

  const handleRetrieve = useCallback(async () => {
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
        `${apiBaseUrl}/api/scheduler/retrieve`,
        {
          code: retrieveCode,
        },
      );

      setRetrieveResult(response.data);
      toast.success("Content retrieved successfully!");
    } catch (error: any) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error?.message;

      if (status === 404) {
        toast.error("Code not found or expired");
      } else if (status === 423) {
        toast.error("Content is still locked. Check unlock time.");
      } else {
        toast.error(errorMessage || "Failed to retrieve content");
      }
      setRetrieveResult(null);
    } finally {
      setLoading(false);
    }
  }, [retrieveCode, apiBaseUrl]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const formatDateTime = (dateString: string): string => {
    return format(new Date(dateString), "PPP p");
  };

  const getTimeUntilUnlock = (unlockAt: string): string => {
    const now = new Date().getTime();
    const unlock = new Date(unlockAt).getTime();
    const diff = unlock - now;

    if (diff <= 0) return "Unlocked";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
            <SEOHead
        title="Time-Locked Sharing - Schedule Content to Unlock Later"
        description="Schedule content to unlock at specific date and time. Perfect for announcements, surprises, and time-sensitive information sharing."
        keywords="time locked sharing, scheduled content, timed release, content scheduler, delayed sharing"
        canonicalUrl="/scheduler"
      />
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          Time-Locked Sharing
        </h1>
        <p className="text-lg text-slate-400">
          Schedule content to unlock at a specific date and time
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
            Schedule Content
          </button>
          <button
            onClick={() => setActiveTab("retrieve")}
            className={`px-6 py-3 rounded transition-colors ${
              activeTab === "retrieve"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Retrieve Content
          </button>
        </div>
      </div>

      {activeTab === "create" && (
        <div className="space-y-6">
          {!scheduledItem ? (
            <div className="tool-card">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
                <Clock className="w-5 h-5 mr-2 text-amber-500" />
                Schedule Content
              </h3>

              <div className="space-y-4">
                {/* Content Type */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-300">
                    Content Type
                  </label>
                  <div className="p-1 rounded-lg bg-slate-800">
                    <button
                      onClick={() => setContentType("text")}
                      className={`px-4 py-2 rounded transition-colors ${
                        contentType === "text"
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Text Content
                    </button>
                    <button
                      onClick={() => setContentType("file")}
                      className={`px-4 py-2 rounded transition-colors ${
                        contentType === "file"
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      File Link
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-slate-300"
                  >
                    Title (Optional)
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your scheduled content a title..."
                    className="input-field"
                  />
                </div>

                {/* Content */}
                <div>
                  <label
                    htmlFor="content"
                    className="block mb-2 text-sm font-medium text-slate-300"
                  >
                    {contentType === "text" ? "Text Content" : "File Link/URL"}
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      contentType === "text"
                        ? "Enter the text content to be unlocked..."
                        : "Enter the file sharing link or URL..."
                    }
                    className="h-32 textarea-field"
                    maxLength={10000}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {content.length}/10,000 characters
                  </p>
                </div>

                {/* Unlock DateTime */}
                <div>
                  <label
                    htmlFor="unlock-time"
                    className="block mb-2 text-sm font-medium text-slate-300"
                  >
                    Unlock Date & Time
                  </label>
                  <input
                    id="unlock-time"
                    type="datetime-local"
                    value={unlockDateTime}
                    onChange={(e) => setUnlockDateTime(e.target.value)}
                    min={getMinDateTime()}
                    max={getMaxDateTime()}
                    className="input-field"
                  />

                  {/* Quick Time Buttons */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setQuickTime("minutes", 30)}
                      className="text-xs btn-secondary"
                    >
                      +30 min
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickTime("hours", 1)}
                      className="text-xs btn-secondary"
                    >
                      +1 hour
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickTime("hours", 24)}
                      className="text-xs btn-secondary"
                    >
                      +1 day
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickTime("days", 7)}
                      className="text-xs btn-secondary"
                    >
                      +1 week
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSchedule}
                  disabled={loading || !content.trim() || !unlockDateTime}
                  className="w-full btn-primary"
                >
                  {loading ? "Scheduling..." : "Schedule Content"}
                </button>
              </div>
            </div>
          ) : (
            <div className="tool-card">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
                <Lock className="w-5 h-5 mr-2 text-green-500" />
                Content Scheduled Successfully
              </h3>
              <div className="space-y-4">
                <div className="p-4 border-2 rounded-lg bg-slate-900 border-green-500/30">
                  <div className="text-center">
                    <p className="mb-2 text-slate-300">Your access code is:</p>
                    <div className="mb-2 font-mono text-3xl font-bold text-green-400">
                      {scheduledItem.code}
                    </div>
                    <button
                      onClick={() => handleCopy(scheduledItem.code)}
                      className="btn-copy"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2 rounded bg-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Unlock Time:</span>
                    <span className="text-white">
                      {formatDateTime(scheduledItem.unlockAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Time Until Unlock:</span>
                    <span className="font-mono text-amber-400">
                      {getTimeUntilUnlock(scheduledItem.unlockAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Expires:</span>
                    <span className="text-white">
                      {formatDateTime(scheduledItem.expiresAt)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setScheduledItem(null);
                    setContent("");
                    setTitle("");
                    setUnlockDateTime("");
                  }}
                  className="w-full btn-secondary"
                >
                  Schedule More Content
                </button>
              </div>
            </div>
          )}

          <GoogleAdSlot adSlotId="3456789012" />
        </div>
      )}

      {activeTab === "retrieve" && (
        <div className="space-y-6">
          <div className="tool-card">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Retrieve Scheduled Content
            </h3>
            <div className="space-y-4">
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
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  placeholder="000000"
                  className="font-mono text-lg text-center input-field"
                  maxLength={6}
                />
              </div>

              <button
                onClick={handleRetrieve}
                className="w-full btn-primary"
                disabled={loading || retrieveCode.length !== 6}
              >
                {loading ? "Checking..." : "Retrieve Content"}
              </button>
            </div>
          </div>

          {retrieveResult && (
            <div className="tool-card">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
                <Share className="w-5 h-5 mr-2 text-green-500" />
                Retrieved Content
              </h3>
              <div className="space-y-4">
                {retrieveResult.title && (
                  <div>
                    <h4 className="text-lg font-medium text-white">
                      {retrieveResult.title}
                    </h4>
                  </div>
                )}

                <div className="p-4 rounded bg-slate-800">
                  {retrieveResult.type === "text" ? (
                    <div className="whitespace-pre-wrap text-slate-300">
                      {retrieveResult.content}
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2 text-slate-400">File Link:</p>
                      <a
                        href={retrieveResult.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline break-all hover:text-blue-300"
                      >
                        {retrieveResult.content}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleCopy(retrieveResult.content)}
                    className="inline-flex items-center space-x-2 btn-copy"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Content</span>
                  </button>
                  {retrieveResult.type === "file" && (
                    <a
                      href={retrieveResult.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 btn-secondary"
                    >
                      <Share className="w-4 h-4" />
                      <span>Open Link</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <GoogleAdSlot adSlotId="4567890123" />
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 tool-card">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
          <Calendar className="w-5 h-5 mr-2 text-amber-500" />
          Time-Locked Sharing Features
        </h3>
        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium text-white">Scheduling Options:</h4>
            <ul className="space-y-1 text-slate-400">
              <li>✓ Schedule up to 30 days in advance</li>
              <li>✓ Minimum 5 minutes from current time</li>
              <li>✓ Support for text content and file links</li>
              <li>✓ Optional titles for organization</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium text-white">Use Cases:</h4>
            <ul className="space-y-1 text-slate-400">
              <li>Birthday messages and surprises</li>
              <li>Time-sensitive announcements</li>
              <li>Scheduled file releases</li>
              <li>Event-based content delivery</li>
              <li>Educational material timing</li>
              <li>Marketing campaign launches</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
