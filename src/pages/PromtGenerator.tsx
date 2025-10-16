import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, Check, Zap, Sparkles } from 'lucide-react';

export default function PromptGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState([]);
  const outputRef = useRef(null);

  const templates = [
    { id: 'marketing', label: 'Marketing', icon: '📢' },
    { id: 'code', label: 'Code', icon: '💻' },
    { id: 'content', label: 'Content', icon: '✍️' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'creative', label: 'Creative', icon: '🎨' },
    { id: 'business', label: 'Business', icon: '💼' },
  ];

  const systemInstruction = `You are a professional prompt engineer. Your task is to generate clear, effective, and structured prompts only. 

Guidelines:
- Generate ONLY the prompt output
- Use plain text format
- Remove all special characters, symbols, or formatting
- Make it direct and actionable
- Keep it concise and clear
- Do not include any explanations or additional text
- Output only the final prompt`;

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setOutput('');

    try {
      const templateContext = selectedTemplate.length > 0 ? `Templates: ${selectedTemplate.join(', ')}. ` : '';
      const response = await fetch('https://inpitech.app.n8n.cloud/webhook-test/3a3301b3-d7c5-4b90-b355-1e4b4362d6d3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${systemInstruction}\n\n${templateContext}User request: ${input}`,
          userId: 'prompt_generator',
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();
      const result = data?.output || data?.response || 'No response generated';
      setOutput(result);
    } catch (error) {
      console.error('Error:', error);
      setOutput('Error generating prompt. Please try again.');
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bg-purple-600 rounded-full top-20 left-10 w-72 h-72 mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bg-blue-600 rounded-full top-40 right-10 w-72 h-72 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bg-pink-600 rounded-full bottom-10 left-1/2 w-72 h-72 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-5xl font-bold text-transparent md:text-6xl bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              Prompt Generator
            </h1>
          </div>
          <p className="mt-4 text-xl text-gray-300">Transform your ideas into powerful prompts instantly</p>
        </div>

        {/* Main Content Box */}
        <div className="w-full max-w-4xl p-8 border shadow-2xl bg-slate-900/50 backdrop-blur-xl border-purple-500/20 rounded-3xl">
          
          {/* Template Selection - Multi Select */}
          <div className="mb-8">
            <label className="flex items-center block gap-2 mb-4 text-sm font-semibold text-gray-300">
              <Zap className="w-4 h-4 text-yellow-400" />
              Choose Templates (Select Multiple)
            </label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    if (selectedTemplate.includes(template.id)) {
                      setSelectedTemplate(selectedTemplate.filter(id => id !== template.id));
                    } else {
                      setSelectedTemplate([...selectedTemplate, template.id]);
                    }
                  }}
                  className={`p-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedTemplate.includes(template.id)
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 border border-purple-400 scale-105 ring-2 ring-purple-400/50'
                      : 'bg-slate-800 border border-slate-700 hover:border-purple-500 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">{template.icon}</span>
                  <div className="mt-1 text-xs">{template.label}</div>
                </button>
              ))}
            </div>
            {selectedTemplate.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTemplate.map((id) => {
                  const template = templates.find(t => t.id === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-2 px-3 py-1 text-xs text-purple-200 border rounded-full bg-purple-900/50 border-purple-500/50"
                    >
                      {template.icon} {template.label}
                      <button
                        onClick={() => setSelectedTemplate(selectedTemplate.filter(t => t !== id))}
                        className="ml-1 hover:text-purple-100"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <label className="block mb-3 text-sm font-semibold text-gray-300">
              Describe Your Prompt
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me what you want... e.g., 'Create a prompt for writing blog posts about AI' or 'Generate a prompt for social media marketing'"
              className="w-full px-5 py-4 text-white placeholder-gray-400 transition-all duration-300 border resize-none bg-slate-800/50 border-purple-500/30 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
              rows="4"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              <Send size={20} />
              {loading ? 'Generating Magic...' : 'Generate Prompt'}
            </button>
          </div>

          {/* Output Section */}
          {output && (
            <div className="p-6 border bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-purple-500/30 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-purple-300">Your Generated Prompt</h3>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="p-5 border bg-slate-900/70 rounded-xl border-slate-700/50">
                <div
                  ref={outputRef}
                  className="text-base font-light leading-relaxed text-gray-100 break-words whitespace-pre-wrap"
                >
                  {output}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center p-8 border bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-purple-500/30 rounded-2xl">
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-bounce"></div>
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {/* Tips Section */}
          {!output && !loading && (
            <div className="p-6 mt-8 border bg-slate-800/30 border-slate-700/50 rounded-2xl">
              <h4 className="mb-3 font-semibold text-gray-300">💡 Tips for Best Results</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Be specific about what you want the prompt to do</li>
                <li>• Choose a template that matches your use case</li>
                <li>• Mention the tone or style you prefer</li>
                <li>• Include any specific requirements or constraints</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">Powered by AI Prompt Generator</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}