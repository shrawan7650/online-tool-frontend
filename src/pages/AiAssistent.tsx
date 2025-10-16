import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Menu, X, MessageSquare, Zap, Settings, Workflow } from 'lucide-react';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, text: '👋 How can I help you today? I\'m SmartGenius — your personal AI assistant.', sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
  
    try {
      const response = await fetch('https://inpitech.app.n8n.cloud/webhook-test/3a3301b3-d7c5-4b90-b355-1e4b4362d6d3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          userId: 'demo_user_001', // optional, useful for tracking
          timestamp: new Date().toISOString()
        }),
      });
  
      const data = await response.json();
  
      const aiMessage = {
        id: Date.now() + 1,
        text: data?.output || data?.response || "⚙️ No response from AI.",
        sender: 'ai',
      };
  
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI API Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '⚠️ Something went wrong. Please try again.',
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  
    setLoading(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen text-white bg-black font-poppins">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-black">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu size={24} className="text-blue-400" />
            </button>
            <h2 className="text-xl font-semibold">Chat with SmartGenius</h2>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none'
                    : 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-100 rounded-bl-none shadow-lg shadow-purple-500/20'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
              </div>
              <div className="px-4 py-3 rounded-bl-none shadow-lg bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl shadow-purple-500/20">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 delay-100 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 delay-200 bg-blue-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-slate-800 bg-gradient-to-r from-slate-900 to-black">
          <div className="flex max-w-4xl gap-3 mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 px-5 py-3 text-white transition border rounded-full bg-slate-800 border-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
            <button className="flex items-center justify-center w-12 h-12 transition border rounded-full bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300">
              <Mic size={20} />
            </button>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="flex items-center justify-center w-12 h-12 transition rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} className="text-white" />
            </button>
          </div>
          <p className="mt-3 text-xs text-center text-slate-500">Powered by SmartGenius AI x n8n Automation</p>
        </div>
      </div>
    </div>
  );
}