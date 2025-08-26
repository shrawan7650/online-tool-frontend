import { useState, useCallback } from 'react';
import { Copy, ArrowRight, ArrowLeft, Braces } from 'lucide-react';
import toast from 'react-hot-toast';
import { GoogleAdSlot } from '../components/GoogleAdSlot';
import React from 'react'; 
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
    <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">JSON Escape/Unescape</h1>
        <p className="text-lg text-slate-400">
          Escape JSON strings for safe embedding or unescape to readable text
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="p-1 rounded-lg bg-slate-800">
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

      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        {/* Input Section */}
        <div className="tool-card">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
            Input Text
            {mode === 'escape' ? (
              <ArrowRight className="w-5 h-5 ml-2 text-yellow-500" />
            ) : (
              <ArrowLeft className="w-5 h-5 ml-2 text-yellow-500" />
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
              className="h-32 font-mono textarea-field"
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
          <h3 className="flex items-center mb-4 text-lg font-semibold text-white">
            <Braces className="w-5 h-5 mr-2 text-yellow-500" />
            Result
          </h3>
          {result ? (
            <div className="space-y-4">
              <textarea
                value={result}
                readOnly
                className="h-32 font-mono text-sm textarea-field bg-slate-900"
                aria-label="Processed result"
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

      <GoogleAdSlot adSlotId="4567890123" />

      {/* Info Section */}
      <div className="mt-8 tool-card">
        <h3 className="mb-4 text-lg font-semibold text-white">About JSON Escaping</h3>
        <div className="prose prose-invert max-w-none">
          <p className="mb-4 text-slate-400">
            JSON escaping is the process of encoding special characters in strings so they 
            can be safely included in JSON data. This prevents parsing errors and ensures 
            data integrity when transmitting or storing JSON.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-white">Characters that need escaping:</h4>
              <ul className="space-y-1 font-mono text-sm text-slate-400">
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
              <h4 className="mb-2 font-medium text-white">Use Cases:</h4>
              <ul className="space-y-1 text-sm text-slate-400">
                <li>API request/response bodies</li>
                <li>Configuration files</li>
                <li>Database storage</li>
                <li>Message queues</li>
                <li>Web socket communication</li>
                <li>Log file formatting</li>
              </ul>
            </div>
          </div>
          <div className="p-4 mt-6 rounded-lg bg-slate-900">
            <h4 className="mb-2 font-medium text-white">Example:</h4>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <span className="text-slate-500">Input:</span>
                <span className="ml-2 text-slate-300">Hello "World"!</span>
              </div>
              <div>
                <span className="text-slate-500">Escaped:</span>
                <span className="ml-2 text-slate-300">Hello \"World\"!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}