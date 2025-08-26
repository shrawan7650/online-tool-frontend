import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Share,
  Copy,
  Download,
  Clock,
  Eye,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { GoogleAdSlot } from "../components/GoogleAdSlot";

interface UploadResponse {
  code: string;
  url: string;
  filename: string;
  size: number;
  expiresAt: string;
  previewUrl?: string;
}

interface RetrieveResponse {
  filename: string;
  url: string;
  size: number;
  type: string;
  expiresAt: string;
  previewUrl?: string;
}

const EXPIRY_OPTIONS = [
  { value: "5m", label: "5 minutes (auto-delete after retrieval)" },
  { value: "1h", label: "1 hour" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
];

export function FileSharingPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "retrieve">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [expiresIn, setExpiresIn] = useState("24h");
  const [retrieveCode, setRetrieveCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [retrieveResult, setRetrieveResult] = useState<RetrieveResponse | null>(
    null
  );
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 2) {
      toast.error("Maximum 2 files allowed");
      return;
    }

    setFiles(acceptedFiles);
    setUploadResult(null);
    setPreviewFile(null); // Clear any previous preview
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 2,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleUpload = useCallback(async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("expiresIn", expiresIn);

      const response = await axios.post<UploadResponse>(
        `${apiBaseUrl}/api/files/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadResult(response.data);
      toast.success("Files uploaded successfully!");

      // Generate preview after upload
      const firstFile = files[0];
      if (firstFile) {
        const reader = new FileReader();
        reader.onload = () => setPreviewFile(reader.result as string);

        // For PDFs, images, or any other supported files
        reader.readAsDataURL(firstFile);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message || "Failed to upload files"
      );
    } finally {
      setLoading(false);
    }
  }, [files, expiresIn, apiBaseUrl]);

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
        `${apiBaseUrl}/api/files/retrieve`,
        {
          code: retrieveCode,
        }
      );

      setRetrieveResult(response.data);
      setRetrieveCode("");
      toast.success("File retrieved successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to retrieve file";
      if (error.response?.status === 404) {
        toast.error("Code not found or expired");
      } else {
        toast.error(errorMessage);
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

  const isImageFile = (filename: string): boolean => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);
  };

  const isPDFFile = (filename: string): boolean => {
    return /\.pdf$/i.test(filename);
  };
  const handleDirectDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch file");

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up
      URL.revokeObjectURL(blobUrl);
      toast.success("File downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Download failed");
    }
  };

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          File Sharing
        </h1>
        <p className="text-lg text-slate-400">
          Upload and share files securely with automatic expiry and preview
          support
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="p-1 rounded-lg bg-slate-800">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 rounded transition-colors ${
              activeTab === "upload"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Upload Files
          </button>
          <button
            onClick={() => setActiveTab("retrieve")}
            className={`px-6 py-3 rounded transition-colors ${
              activeTab === "retrieve"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Retrieve Files
          </button>
        </div>
      </div>

      {activeTab === "upload" && (
        <div className="space-y-6">
          {!uploadResult ? (
            <>
              <div className="tool-card">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
                  <Upload className="w-5 h-5 mr-2 text-pink-500" />
                  Upload Files (Max 2 files, 50MB each)
                </h3>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-4 ${
                    isDragActive
                      ? "border-pink-500 bg-pink-500/10"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                  {isDragActive ? (
                    <p className="text-pink-400">Drop the files here...</p>
                  ) : (
                    <div>
                      <p className="mb-2 text-slate-300">
                        Drag & drop files here, or click to select
                      </p>
                      <p className="text-sm text-slate-500">
                        Images, documents, videos • Max 2 files • Up to 50MB
                        each
                      </p>
                    </div>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-medium text-white">
                        Selected Files:
                      </h4>
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded bg-slate-800"
                        >
                          <div>
                            <p className="font-medium text-white">
                              {file.name}
                            </p>
                            <p className="text-sm text-slate-400">
                              {formatFileSize(file.size)} •{" "}
                              {file.type || "unknown type"}
                            </p>
                          </div>

                          {(isImageFile(file.name) ||
                            isPDFFile(file.name) ||
                            file.type.startsWith("video/")) && (
                            <button
                              onClick={() => {
                                setPreviewFile(file);
                                setIsPreviewOpen(true);
                              }}
                              className="text-sm text-blue-400 hover:underline"
                            >
                              Preview
                            </button>
                          )}
                        </div>
                      ))}
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

                    <button
                      onClick={handleUpload}
                      disabled={loading}
                      className="w-full btn-primary"
                    >
                      {loading ? "Uploading..." : "Upload & Generate Code"}
                    </button>
                  </div>
                )}
                {isPreviewOpen && previewFile && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 rounded-xl border border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-auto p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">
                          {previewFile.name}
                        </h3>
                        <button
                          onClick={() => setIsPreviewOpen(false)}
                          className="text-white hover:text-pink-500"
                        >
                          X
                        </button>
                      </div>

                      <div className="flex items-center justify-center">
                        {/* Image Preview */}
                        {isImageFile(previewFile.name) && (
                          <img
                            src={URL.createObjectURL(previewFile)}
                            alt="Preview"
                            className="max-w-full max-h-[70vh] object-contain"
                          />
                        )}

                        {/* PDF Preview */}
                        {isPDFFile(previewFile.name) && (
                          <iframe
                            src={URL.createObjectURL(previewFile)}
                            className="w-full h-[70vh] border rounded"
                          ></iframe>
                        )}

                        {/* Video Preview */}
                        {previewFile.type.startsWith("video/") && (
                          <video
                            src={URL.createObjectURL(previewFile)}
                            controls
                            className="max-w-full max-h-[70vh] rounded"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="tool-card">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
                <Share className="w-5 h-5 mr-2 text-green-500" />
                Files Uploaded Successfully
              </h3>
              <div className="space-y-4">
                <div className="p-4 border-2 rounded-lg bg-slate-900 border-green-500/30">
                  <div className="text-center">
                    <p className="mb-2 text-slate-300">Your sharing code is:</p>
                    <div className="mb-2 font-mono text-3xl font-bold text-green-400">
                      {uploadResult.code}
                    </div>
                    <button
                      onClick={() => handleCopy(uploadResult.code)}
                      className="btn-copy"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded bg-slate-800">
                  <p className="font-medium text-white">
                    {uploadResult.filename}
                  </p>
                  <p className="text-sm text-slate-400">
                    {formatFileSize(uploadResult.size)} •{" "}
                    {formatTimeRemaining(uploadResult.expiresAt)}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setFiles([]);
                    setUploadResult(null);
                  }}
                  className="w-full btn-secondary"
                >
                  Upload More Files
                </button>
              </div>
            </div>
          )}

          <GoogleAdSlot adSlotId="9012345678" />
        </div>
      )}

      {activeTab === "retrieve" && (
        <div className="space-y-6">
          <div className="tool-card">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Retrieve Files
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
                      e.target.value.replace(/\D/g, "").slice(0, 6)
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
                {loading ? "Retrieving..." : "Fetch Files"}
              </button>
            </div>
          </div>

          {retrieveResult && (
            <div className="tool-card">
              <h3 className="flex gap-5 mb-4 text-lg text-white t-semibold itenms-center">
                Retrieved Files{" "}
                <div className="flex items-center text-sm text-slate-400">
                  <Clock className="inline w-4 h-4 mr-1" />
                  {formatTimeRemaining(retrieveResult.expiresAt)}
                </div>
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded bg-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-white">
                        {retrieveResult.filename}
                      </p>
                      <p className="text-sm text-slate-400">
                        {formatFileSize(retrieveResult.size)} •{" "}
                        {retrieveResult.type}
                      </p>
                    </div>
                  </div>

                  {retrieveResult.previewUrl &&
                    isImageFile(retrieveResult.filename) && (
                      <div className="mb-4">
                        <img
                          src={retrieveResult.previewUrl}
                          alt="Preview"
                          className="h-auto max-w-full border rounded border-slate-600"
                          style={{ maxHeight: "300px" }}
                        />
                      </div>
                    )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        handleDirectDownload(
                          retrieveResult.url,
                          retrieveResult.filename
                        )
                      }
                      className="inline-flex items-center space-x-2 btn-primary"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download File</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <GoogleAdSlot adSlotId="0123456789" />
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 tool-card">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
          <AlertCircle className="w-5 h-5 mr-2 text-pink-500" />
          File Sharing Features
        </h3>
        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium text-white">
              Automatic Management:
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li>✓ Auto-delete after 5 minutes if retrieved</li>
              <li>✓ Configurable expiry (5m to 7 days)</li>
              
            
              <li>✓ Preview support for images and PDFs</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium text-white">Security & Limits:</h4>
            <ul className="space-y-1 text-slate-400">
              <li>✓ Maximum 2 files per upload</li>
              <li>✓ 50MB file size limit</li>
              <li>✓ Secure 6-digit access codes</li>
              <li>✓ Rate limiting protection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
