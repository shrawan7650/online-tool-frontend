import { useState, useEffect, useCallback } from 'react';
import { Copy, Download, Clock, Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

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
  { value: '15m', label: '15 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' }
];

export function ClipboardPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'retrieve'>('create');
  const [text, setText] = useState('');
  const [pin, setPin] = useState('');
  const [expiresIn, setExpiresIn] = useState('1h');
  const [retrieveCode, setRetrieveCode] = useState('');
  const [retrievePin, setRetrievePin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showRetrievePin, setShowRetrievePin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdClip, setCreatedClip] = useState<ClipboardResponse | null>(null);
  const [retrievedText, setRetrievedText] = useState<RetrieveResponse | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(text.length > 0 && !createdClip);
  }, [text, createdClip]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleCreate = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    if (text.length > MAX_CHARS) {
      toast.error(`Text too long (max ${MAX_CHARS.toLocaleString()} characters)`);
      return;
    }

    if (pin && (pin.length !== 4 || !/^\d+$/.test(pin))) {
      toast.error('PIN must be exactly 4 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<ClipboardResponse>(`${apiBaseUrl}/api/clipboard`, {
        text,
        pin: pin || undefined,
        expiresIn
      });
      
      setCreatedClip(response.data);
      setHasUnsavedChanges(false);
      toast.success('Clipboard note created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to create clipboard note');
    } finally {
      setLoading(false);
    }
  }, [text, pin, expiresIn, apiBaseUrl]);

  const handleRetrieve = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!retrieveCode.trim()) {
      toast.error('Please enter a code');
      return;
    }

    if (!/^\d{6}$/.test(retrieveCode)) {
      toast.error('Code must be exactly 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<RetrieveResponse>(`${apiBaseUrl}/api/clipboard/retrieve`, {
        code: retrieveCode,
        pin: retrievePin || undefined
      });
      
      setRetrievedText(response.data);
      toast.success('Clipboard note retrieved successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to retrieve clipboard note';
      if (error.response?.status === 404) {
        toast.error('Code not found or expired');
      } else if (error.response?.status === 401) {
        toast.error('Incorrect PIN');
      } else {
        toast.error(errorMessage);
      }
      setRetrievedText(null);
    } finally {
      setLoading(false);
    }
  }, [retrieveCode, retrievePin, apiBaseUrl]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = (text: string, filename = 'clipboard-note.txt') => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded successfully');
  };

  const handleNewNote = () => {
    setText('');
    setPin('');
    setExpiresIn('1h');
    setCreatedClip(null);
    setHasUnsavedChanges(false);
  };

  const formatTimeRemaining = (expiresAt: string): string => {
    const now = new Date().getTime();
    const expires = new Date(expiresAt).getTime();
    const diff = expires - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Secure Online Clipboard</h1>
        <p className="text-slate-400 text-lg">
          Share text securely with temporary codes. Data is encrypted and auto-expires.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 rounded transition-colors ${
              activeTab === 'create' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Note
          </button>
          <button
            onClick={() => setActiveTab('retrieve')}
            className={`px-6 py-3 rounded transition-colors ${
              activeTab === 'retrieve' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Retrieve Note
          </button>
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="space-y-6">
          {!createdClip ? (
            <div className="tool-card">
              <h3 className="text-lg font-semibold text-white mb-4">Create Secure Note</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label htmlFor="text" className="block text-sm font-medium text-slate-300 mb-2">
                    Text Content ({text.length.toLocaleString()}/{MAX_CHARS.toLocaleString()})
                  </label>
                  <textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={MAX_CHARS}
                    placeholder="Enter your text here..."
                    className="textarea-field h-32"
                    aria-describedby="text-help"
                  />
                  <p id="text-help" className="text-xs text-slate-500 mt-1">
                    Your text will be encrypted and stored securely
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pin" className="block text-sm font-medium text-slate-300 mb-2">
                      PIN (Optional)
                    </label>
                    <div className="relative">
                      <input
                        id="pin"
                        type={showPin ? 'text' : 'password'}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="4-digit PIN"
                        className="input-field pr-10"
                        aria-describedby="pin-help"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                      >
                        {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p id="pin-help" className="text-xs text-slate-500 mt-1">
                      Add extra security with a 4-digit PIN
                    </p>
                  </div>

                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-slate-300 mb-2">
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
                  className="btn-primary w-full"
                  disabled={loading || !text.trim()}
                >
                  {loading ? 'Generating...' : 'Generate Secure Code'}
                </button>
              </form>
            </div>
          ) : (
            <div className="tool-card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-500" />
                Note Created Successfully
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-900 rounded-lg p-4 border-2 border-green-500/30">
                  <div className="text-center">
                    <p className="text-slate-300 mb-2">Your secure code is:</p>
                    <div className="text-3xl font-mono font-bold text-green-400 mb-2">
                      {createdClip.code}
                    </div>
                    <button
                      onClick={() => handleCopy(createdClip.code)}
                      className="btn-copy"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
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
                  className="btn-secondary w-full"
                >
                  Create Another Note
                </button>
              </div>
            </div>
          )}

          <GoogleAdSlot adSlotId="6789012345" />
        </div>
      )}

      {activeTab === 'retrieve' && (
        <div className="space-y-6">
          <div className="tool-card">
            <h3 className="text-lg font-semibold text-white mb-4">Retrieve Note</h3>
            <form onSubmit={handleRetrieve} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="retrieve-code" className="block text-sm font-medium text-slate-300 mb-2">
                    6-Digit Code
                  </label>
                  <input
                    id="retrieve-code"
                    type="text"
                    value={retrieveCode}
                    onChange={(e) => setRetrieveCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="input-field font-mono text-lg text-center"
                    maxLength={6}
                  />
                </div>

                <div>
                  <label htmlFor="retrieve-pin" className="block text-sm font-medium text-slate-300 mb-2">
                    PIN (If Set)
                  </label>
                  <div className="relative">
                    <input
                      id="retrieve-pin"
                      type={showRetrievePin ? 'text' : 'password'}
                      value={retrievePin}
                      onChange={(e) => setRetrievePin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="Optional 4-digit PIN"
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRetrievePin(!showRetrievePin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      aria-label={showRetrievePin ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showRetrievePin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={loading || retrieveCode.length !== 6}
              >
                {loading ? 'Retrieving...' : 'Fetch Note'}
              </button>
            </form>
          </div>

          {retrievedText && (
            <div className="tool-card">
              <h3 className="text-lg font-semibold text-white mb-4">Retrieved Note</h3>
              <div className="space-y-4">
                <textarea
                  value={retrievedText.text}
                  readOnly
                  className="textarea-field h-32 bg-slate-900"
                />
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleCopy(retrievedText.text)}
                    className="btn-copy inline-flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>Copy Text</span>
                  </button>
                  <button
                    onClick={() => handleDownload(retrievedText.text)}
                    className="btn-secondary inline-flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
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
      <div className="tool-card mt-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          Security Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="text-white font-medium mb-2">Encryption & Privacy:</h4>
            <ul className="text-slate-400 space-y-1">
              <li>✓ AES-256-GCM encryption</li>
              <li>✓ Server-side encryption at rest</li>
              <li>✓ No logs of content stored</li>
              <li>✓ Automatic expiration</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Access Control:</h4>
            <ul className="text-slate-400 space-y-1">
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