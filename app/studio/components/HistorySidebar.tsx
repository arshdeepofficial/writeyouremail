// app/studio/components/HistorySidebar.tsx
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { History, Clock, ChevronRight } from 'lucide-react';
import { MODES } from '../lib/modeSchemas';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface HistoryItem {
  id: string;
  mode: string;
  content: string;
  created_at: string;
}

interface HistorySidebarProps {
  userId: string | undefined;
  refreshTrigger: number; // Used to trigger a re-fetch when a new generation completes
  onSelectHistory: (content: string) => void;
}

export default function HistorySidebar({ userId, refreshTrigger, onSelectHistory }: HistorySidebarProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      if (!userId || !supabaseUrl || !supabaseKey) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('emails')
          .select('id, mode, content, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20); // Show last 20 generations

        if (error) throw error;
        setHistory(data || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistory();
  }, [userId, refreshTrigger]);

  // Helper to format date cleanly
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Helper to get friendly mode name
  const getModeName = (modeId: string) => {
    const mode = MODES.find(m => m.id === modeId);
    return mode ? mode.name : 'Outreach';
  };

  if (!userId) {
    return (
      <div style={{
        width: '280px',
        height: '100%',
        borderLeft: '1px solid #2a2a2c',
        backgroundColor: '#0a0a0a',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#6e6e73'
      }}>
        <History size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
        <p style={{ fontSize: '13px' }}>Sign in to view your generation history.</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '280px',
      height: '100%',
      borderLeft: '1px solid #2a2a2c',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #2a2a2c',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#ffffff'
      }}>
        <History size={18} color="#0a84ff" />
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Recent History</h3>
      </div>

      <div 
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px'
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#6e6e73', fontSize: '13px' }}>
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 12px', color: '#6e6e73', fontSize: '13px' }}>
            No generations yet. Your creations will appear here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHistory(item.content)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  backgroundColor: '#141415',
                  border: '1px solid #2a2a2c',
                  borderRadius: '10px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1c1c1e';
                  e.currentTarget.style.borderColor = '#3a3a3c';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#141415';
                  e.currentTarget.style.borderColor = '#2a2a2c';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500 }}>
                    {getModeName(item.mode)}
                  </span>
                  <ChevronRight size={14} color="#6e6e73" />
                </div>
                
                <p style={{ 
                  margin: 0, 
                  color: '#a1a1a6', 
                  fontSize: '12px',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.content}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6e6e73', marginTop: '2px' }}>
                  <Clock size={10} />
                  <span style={{ fontSize: '10px' }}>{formatDate(item.created_at)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}