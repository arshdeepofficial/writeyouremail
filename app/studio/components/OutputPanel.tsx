// app/studio/components/OutputPanel.tsx
import React, { useState } from 'react';
import { Copy, Check, AlertCircle, Bot } from 'lucide-react';

interface OutputPanelProps {
  result: string | null;
  isGenerating: boolean;
  error: string | null;
}

export default function OutputPanel({ result, isGenerating, error }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text', err);
      }
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#000000',
      padding: '24px',
      overflowY: 'auto'
    }}>
      <h2 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '18px', 
        fontWeight: 600,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Bot size={20} color="#0a84ff" />
        AI Output
      </h2>

      <div style={{
        flex: 1,
        backgroundColor: '#141415',
        border: '1px solid #2a2a2c',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Error State */}
        {error && (
          <div style={{
            margin: '16px',
            padding: '16px',
            backgroundColor: 'rgba(255, 69, 58, 0.1)',
            border: '1px solid rgba(255, 69, 58, 0.3)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <AlertCircle color="#ff453a" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#ff453a', fontSize: '14px' }}>Generation Failed</h4>
              <p style={{ margin: 0, color: '#ff9f9c', fontSize: '13px', lineHeight: 1.4 }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="skeleton-pulse" style={{ height: '16px', width: '80%', borderRadius: '8px', backgroundColor: '#2a2a2c' }} />
            <div className="skeleton-pulse" style={{ height: '16px', width: '95%', borderRadius: '8px', backgroundColor: '#2a2a2c', animationDelay: '0.1s' }} />
            <div className="skeleton-pulse" style={{ height: '16px', width: '60%', borderRadius: '8px', backgroundColor: '#2a2a2c', animationDelay: '0.2s' }} />
          </div>
        )}

        {/* Empty State */}
        {!result && !isGenerating && !error && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6e6e73',
            fontSize: '14px',
            padding: '32px',
            textAlign: 'center'
          }}>
            Fill out the form on the left and click "Generate Magic" to see your result here.
          </div>
        )}

        {/* Result State */}
        {result && !isGenerating && (
          <>
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10
            }}>
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: copied ? '#30d158' : '#1c1c1e',
                  border: '1px solid #2a2a2c',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
                aria-label="Copy to clipboard"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div 
              className="hide-scrollbar"
              style={{
                padding: '24px',
                paddingTop: '60px', // Space for copy button
                color: '#e5e5ea',
                fontSize: '15px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowY: 'auto',
                flex: 1
              }}
            >
              {result}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skeleton-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}s