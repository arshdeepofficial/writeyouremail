"use client";
// app/studio/components/SupportChatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageCircle } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get bot reply');

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I hit a hiccup connecting to support. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    "What's in the Growth plan?",
    "How do 30-day passes work?",
    "Can I use dynamic forms on mobile?",
    "What happens when I hit my limit?"
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '28px',
          border: 'none',
          background: isOpen ? '#2a2a2c' : 'linear-gradient(135deg, #0a84ff, #bf5af2)',
          color: '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(10, 132, 255, 0.4)',
          zIndex: 9998,
          transition: 'all 0.3s ease'
        }}
        aria-label="Open support chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 48px)',
          height: '540px',
          maxHeight: 'calc(100vh - 140px)',
          backgroundColor: '#141415',
          border: '1px solid #2a2a2c',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #2a2a2c',
            background: 'linear-gradient(135deg, rgba(10,132,255,0.15), rgba(191,90,242,0.15))',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #0a84ff, #bf5af2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                WriteYourEmail Assistant
              </div>
              <div style={{ color: '#8e8e93', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: '#30d158' }} />
                Online · Instant Support
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#8e8e93', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Feed */}
          <div
            ref={chatScrollRef}
            className="hide-scrollbar"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '16px 0', color: '#8e8e93', fontSize: '13px' }}>
                <Bot size={32} color="#0a84ff" style={{ marginBottom: '8px' }} />
                <div style={{ color: '#fff', fontWeight: 600, marginBottom: '4px' }}>Welcome to WriteYourEmail!</div>
                <div>Ask me anything about tiers, features, or generation credits.</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                  {presetQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #2a2a2c',
                        backgroundColor: '#1c1c1e',
                        color: '#0a84ff',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.borderColor = '#0a84ff')}
                      onMouseOut={(e) => (e.currentTarget.style.borderColor = '#2a2a2c')}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  backgroundColor: msg.role === 'user' ? '#0a84ff' : '#1c1c1e',
                  color: '#ffffff',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '14px',
                  backgroundColor: '#1c1c1e',
                  color: '#8e8e93',
                  fontSize: '13px'
                }}>
                  Assistant is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #2a2a2c',
            backgroundColor: '#0a0a0a',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask a question..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #2a2a2c',
                backgroundColor: '#1c1c1e',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: (loading || !input.trim()) ? '#2a2a2c' : '#0a84ff',
                color: '#fff',
                cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}