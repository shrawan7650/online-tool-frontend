import { useState, useCallback } from 'react';
import { Copy, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

export function URLEncodePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleProcess = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }

    try {
      if (mode === 'encode') {
        setResult(encodeURIComponent(input));
        toast.success('Text encoded successfully');
      } else {
        setResult(decodeURIComponent(input));
        toast.success('Text decoded successfully');
      }
    } catch (error) {
      toast.error('Invalid input for URL decoding');
      setResult('');
    }
  }, [input, mode]);

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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">URL Encode/Decode</h1>
        <p className="text-slate-400 text-lg">
          Safely encode URLs for transmission or decode encoded URLs back to readable text
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Input Section */}
        <div className="tool-card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            Input Text
            {mode === 'encode' ? (
              <ArrowRight className="h-5 w-5 ml-2 text-blue-500" />
            ) : (
              <ArrowLeft className="h-5 w-5 ml-2 text-blue-500" />
            )}
          </h3>
          <form onSubmit={handleProcess} className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={mode === 'encode' 
                ? 'Enter text to encode (e.g., hello world!)' 
                : 'Enter URL-encoded text (e.g., hello%20world%21)'
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
                {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
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
          <h3 className="text-lg font-semibold text-white mb-4">
            Result
          </h3>
          {result ? (
            <div className="space-y-4">
              <textarea
                value={result}
                readOnly
                className="textarea-field h-32 bg-slate-900"
                aria-label="Encoded/decoded result"
              />
              <button
                onClick={() => handleCopy(result)}
                className="btn-copy inline-flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Result</span>
              </button>
            </div>
          ) : (
            <div className="h-32 bg-slate-900 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-700">
              <p className="text-slate-500">Result will appear here</p>
            </div>
          )}
        </div>
      </div>

      <GoogleAdSlot adSlotId="2345678901" />

      {/* Info Section */}
      <div className="tool-card mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">About URL Encoding</h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-400">
            URL encoding (also called percent-encoding) is used to encode special characters 
            in URLs to ensure they are transmitted safely over the internet. Characters like 
            spaces, ampersands, and question marks have special meanings in URLs and must be encoded.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h4 className="text-white font-medium mb-2">Common Encodings:</h4>
              <ul className="text-slate-400 space-y-1 text-sm">
                <li>Space → %20</li>
                <li>! → %21</li>
                <li># → %23</li>
                <li>& → %26</li>
                <li>? → %3F</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Use Cases:</h4>
              <ul className="text-slate-400 space-y-1 text-sm">
                <li>Query parameters</li>
                <li>Form data submission</li>
                <li>API endpoint URLs</li>
                <li>Email link parameters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}