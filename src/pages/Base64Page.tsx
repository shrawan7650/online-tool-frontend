import { useState, useCallback } from 'react';
import { Copy, ArrowRight, ArrowLeft, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

export function Base64Page() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState(false);

  const handleProcess = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }

    try {
      if (mode === 'encode') {
        let encoded = btoa(unescape(encodeURIComponent(input)));
        if (urlSafe) {
          encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        }
        setResult(encoded);
        toast.success('Text encoded successfully');
      } else {
        let toDecode = input;
        if (urlSafe) {
          toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/');
          // Add padding if needed
          while (toDecode.length % 4) {
            toDecode += '=';
          }
        }
        const decoded = decodeURIComponent(escape(atob(toDecode)));
        setResult(decoded);
        toast.success('Text decoded successfully');
      }
    } catch (error) {
      toast.error('Invalid Base64 input');
      setResult('');
    }
  }, [input, mode, urlSafe]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleProcess();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Base64 Encode/Decode</h1>
        <p className="text-slate-400 text-lg">
          Convert text to Base64 encoding or decode Base64 strings back to readable text
        </p>
      </div>

      {/* Mode Toggle & Options */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <div className="bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded transition-colors ${
              mode === 'encode' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded transition-colors ${
              mode === 'decode' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Decode
          </button>
        </div>
        
        <label className="flex items-center space-x-2 text-slate-300">
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={(e) => setUrlSafe(e.target.checked)}
            className="rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500"
          />
          <span>URL Safe</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Input Section */}
        <div className="tool-card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            Input Text
            {mode === 'encode' ? (
              <ArrowRight className="h-5 w-5 ml-2 text-emerald-500" />
            ) : (
              <ArrowLeft className="h-5 w-5 ml-2 text-emerald-500" />
            )}
          </h3>
          <form onSubmit={handleProcess} className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={mode === 'encode' 
                ? 'Enter text to encode (supports Unicode)' 
                : 'Enter Base64 encoded text'
              }
              className="textarea-field h-32"
              aria-label={`Text to ${mode}`}
            />
            <div className="flex space-x-3">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={!input.trim()}
              >
                {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
              </button>
              <button
                type="button"
                onClick={() => setInput('')}
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
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-emerald-500" />
            Result
          </h3>
          {result ? (
            <div className="space-y-4">
              <textarea
                value={result}
                readOnly
                className="textarea-field h-32 bg-slate-900 font-mono text-sm"
                aria-label="Encoded/decoded result"
              />
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleCopy(result)}
                  className="btn-copy inline-flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Result</span>
                </button>
                <span className="text-slate-500 text-sm">
                  {result.length} characters
                </span>
              </div>
            </div>
          ) : (
            <div className="h-32 bg-slate-900 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-700">
              <p className="text-slate-500">Result will appear here</p>
            </div>
          )}
        </div>
      </div>

      <GoogleAdSlot adSlotId="3456789012" />

      {/* Info Section */}
      <div className="tool-card mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">About Base64 Encoding</h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-400 mb-4">
            Base64 is a binary-to-text encoding scheme that represents binary data in ASCII 
            format by translating it into a base-64 representation. It's commonly used for 
            encoding binary data in contexts where only text is allowed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">Standard Base64:</h4>
              <ul className="text-slate-400 space-y-1 text-sm">
                <li>Uses A-Z, a-z, 0-9, +, /</li>
                <li>Uses = for padding</li>
                <li>76 characters per line (MIME)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">URL-Safe Base64:</h4>
              <ul className="text-slate-400 space-y-1 text-sm">
                <li>Replaces + with - and / with _</li>
                <li>Removes padding (=)</li>
                <li>Safe for URLs and filenames</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-white font-medium mb-2">Common Use Cases:</h4>
            <ul className="text-slate-400 space-y-1 text-sm">
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