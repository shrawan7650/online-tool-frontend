import React,{ useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileCheck, Copy, Hash, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

interface FileHashResult {
  filename: string;
  size: number;
  type: string;
  hashes: Record<HashAlgorithm, string>;
}

export function FileHashPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<FileHashResult[]>([]);
  const [loading, setLoading] = useState(false);

  const generateFileHash = useCallback(async (file: File, algorithm: HashAlgorithm): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest(
      algorithm === 'md5' ? 'SHA-1' : // MD5 not available, fallback to SHA-1
      algorithm === 'sha1' ? 'SHA-1' :
      algorithm === 'sha256' ? 'SHA-256' : 'SHA-512',
      arrayBuffer
    );
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }, []);

  const processFiles = useCallback(async () => {
    if (files.length === 0) {
      toast.error('Please select files to hash');
      return;
    }

    setLoading(true);
    try {
      const newResults: FileHashResult[] = [];

      for (const file of files) {
        const hashes: Record<HashAlgorithm, string> = {
          md5: 'MD5 not available in browser',
          sha1: await generateFileHash(file, 'sha1'),
          sha256: await generateFileHash(file, 'sha256'),
          sha512: await generateFileHash(file, 'sha512')
        };

        newResults.push({
          filename: file.name,
          size: file.size,
          type: file.type || 'unknown',
          hashes
        });
      }

      setResults(newResults);
      toast.success(`Generated hashes for ${files.length} file(s)`);
    } catch (error) {
      toast.error('Error generating file hashes');
    } finally {
      setLoading(false);
    }
  }, [files, generateFileHash]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 2) {
      toast.error('Maximum 2 files allowed');
      return;
    }
    setFiles(acceptedFiles);
    setResults([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 2,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Hash copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const algorithms: { value: HashAlgorithm; label: string; description: string }[] = [
    { value: 'md5', label: 'MD5', description: '128-bit (legacy)' },
    { value: 'sha1', label: 'SHA-1', description: '160-bit (legacy)' },
    { value: 'sha256', label: 'SHA-256', description: '256-bit (recommended)' },
    { value: 'sha512', label: 'SHA-512', description: '512-bit (highest security)' }
  ];

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">File Hash Online</h1>
        <p className="text-lg text-slate-400">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for your files with drag & drop
        </p>
      </div>

      {/* File Upload Section */}
      <div className="mb-6 tool-card">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
          <Upload className="w-5 h-5 mr-2 text-orange-500" />
          Upload Files (Max 2 files, 100MB each)
        </h3>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-orange-500 bg-orange-500/10' 
              : 'border-slate-600 hover:border-slate-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          {isDragActive ? (
            <p className="text-orange-400">Drop the files here...</p>
          ) : (
            <div>
              <p className="mb-2 text-slate-300">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-slate-500">
                Supports all file types • Max 2 files • Up to 100MB each
              </p>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-white">Selected Files:</h4>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded bg-slate-800">
                <div>
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-sm text-slate-400">
                    {formatFileSize(file.size)} • {file.type || 'unknown type'}
                  </p>
                </div>
              </div>
            ))}
            <button
              onClick={processFiles}
              disabled={loading}
              className="w-full mt-4 btn-primary"
            >
              {loading ? 'Generating Hashes...' : 'Generate File Hashes'}
            </button>
          </div>
        )}
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="mb-8 tool-card">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
            <FileCheck className="w-5 h-5 mr-2 text-orange-500" />
            Hash Results
          </h3>
          <div className="space-y-6">
            {results.map((result, fileIndex) => (
              <div key={fileIndex} className="p-4 border rounded-lg border-slate-700">
                <div className="mb-4">
                  <h4 className="font-medium text-white">{result.filename}</h4>
                  <p className="text-sm text-slate-400">
                    {formatFileSize(result.size)} • {result.type}
                  </p>
                </div>
                <div className="space-y-3">
                  {algorithms.map((algo) => (
                    <div key={algo.value} className="p-3 rounded bg-slate-900">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{algo.label}</span>
                        <span className="text-sm text-slate-400">{algo.description}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 font-mono text-sm break-all text-slate-300">
                          {result.hashes[algo.value]}
                        </div>
                        <button
                          onClick={() => handleCopy(result.hashes[algo.value])}
                          className="btn-copy"
                          disabled={result.hashes[algo.value].includes('not available')}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <GoogleAdSlot adSlotId="8901234567" />

      {/* Info Section */}
      <div className="mt-8 tool-card">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
          <Hash className="w-5 h-5 mr-2 text-orange-500" />
          About File Hashing
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="mb-4 text-slate-400">
            File hashing generates unique fingerprints for files, allowing you to verify 
            file integrity, detect changes, and ensure data hasn't been corrupted or tampered with.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-white">Common Use Cases:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>File integrity verification</li>
                <li>Duplicate file detection</li>
                <li>Digital forensics</li>
                <li>Software distribution verification</li>
                <li>Backup validation</li>
                <li>Change detection</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-white">Security Notes:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>Files are processed locally in your browser</li>
                <li>No files are uploaded to our servers</li>
                <li>SHA-256 recommended for security purposes</li>
                <li>MD5 and SHA-1 are legacy algorithms</li>
              </ul>
            </div>
          </div>
          <div className="p-4 mt-6 border rounded-lg bg-blue-900/20 border-blue-700/30">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="mb-1 font-medium text-blue-400">Privacy First</h4>
                <p className="text-sm text-blue-200">
                  All file processing happens locally in your browser. Your files never leave your device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}