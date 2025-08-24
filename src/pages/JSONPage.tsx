import { useState, useCallback } from 'react';
import { Copy, ArrowRight, ArrowLeft, Braces } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleAdSlot } from '../components/GoogleAdSlot';

export function JSONPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  const handleProcess = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }

    try {
      if (mode === 'escape') {
        const escaped = JSON.stringify(input).slice(1, -1); // Remove outer quotes
        setResult(escaped);
        toast.success('Text escaped successfully');
      } else {
        const unescaped = JSON.parse(`"${input}"`); // Wrap in quotes for parsing
        setResult(unescaped);
        toast.success('Text unescaped successfully');
      }
    } catch (error) {
      toast.error('Invalid input for JSON processing');
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

  const formatJSON = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setResult(formatted);
      toast.success('JSON formatted successfully');
    } catch (error) {
      toast.error('Invalid JSON format');
    }
  }, [input]);

  const minifyJSON = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setResult(minified);
      toast.success('JSON minified successfully');
    } catch (error) {
      toast.error('Invalid JSON format');
    }
  }, [input]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">JSON Escape/Unescape</h1>
        <p className="text-slate-400 text-lg">
          Escape JSON strings for safe embedding or unescape to readable text
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setMode('escape')}
            className={`px-4 py-2 rounded transition-colors ${
              mode === 'escape' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Escape
          </button>
          <button
            onClick={() => setMode('unescape')}
            className={`px-4 py-2 rounded transition-colors ${
              mode === 'unescape' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unescape
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Input Section */}
        <div className="tool-card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            Input Text
            {mode === 'escape' ? (
              <ArrowRight className="h-5 w-5 ml-2 text-yellow-500" />
            ) : (
              <ArrowLeft className="h-5 w-5 ml-2 text-yellow-500" />
            )}
          </h3>
          <form onSubmit={handleProcess} className="space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={mode === 'escape' 
                ? 'Enter text to escape for JSON (e.g., Hello "World"!)' 
                : 'Enter escaped JSON string (e.g., Hello \\"World\\"!)'
              }
              className="textarea-field h-32 font-mono"
              aria-label={`Text to ${mode}`}
            />
            <div className="flex flex-wrap gap-3">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={!input.trim()}
              >
                {mode === 'escape' ? 'Escape JSON' : 'Unescape JSON'}
              </button>
              <button
                type="button"
                onClick={formatJSON}
                className="btn-secondary"
                disabled={!input.trim()}
              >
                Format JSON
              </button>
              <button
                type="button"
                onClick={minifyJSON}
                className="btn-secondary"
                disabled={!input.trim()}
              >
                Minify JSON
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
            <Braces className="h-5 w-5 mr-2 text-yellow-500" />
            Result
          </h3>
          {result ? (
            <div className="space-y-4">
              <textarea
                value={result}
                readOnly
                className="textarea-field h-32 bg-slate-900 font-mono text-sm"
                aria-label="Processed result"
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

      <GoogleAdSlot adSlotId="4567890123" />

      {/* Info Section */}
      <div className="tool-card mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">About JSON Escaping</h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-400 mb-4">
            JSON escaping is the process of encoding special characters in strings so they 
            can be safely included in JSON data. This prevents parsing errors and ensures 
            data integrity when transmitting or storing JSON.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">Characters that need escaping:</h4>
              <ul className="text-slate-400 space-y-1 text-sm font-mono">
                <li>" → \"</li>
                <li>\ → \\</li>
                <li>/ → \/ (optional)</li>
                <li>Backspace → \b</li>
                <li>Form feed → \f</li>
                <li>Newline → \n</li>
                <li>Carriage return → \r</li>
                <li>Tab → \t</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Use Cases:</h4>
              <ul className="text-slate-400 space-y-1 text-sm">
                <li>API request/response bodies</li>
                <li>Configuration files</li>
                <li>Database storage</li>
                <li>Message queues</li>
                <li>Web socket communication</li>
                <li>Log file formatting</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-slate-900 rounded-lg">
            <h4 className="text-white font-medium mb-2">Example:</h4>
            <div className="space-y-2 text-sm font-mono">
              <div>
                <span className="text-slate-500">Input:</span>
                <span className="text-slate-300 ml-2">Hello "World"!</span>
              </div>
              <div>
                <span className="text-slate-500">Escaped:</span>
                <span className="text-slate-300 ml-2">Hello \"World\"!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}