// app/studio/components/ModeDock.tsx
import React from 'react';
import { MODES, PlanTier } from '../lib/modeSchemas';
import { 
  Mail, Sparkles, MessageSquareReply, RefreshCw, Inbox, 
  Users, Twitter, MessageCircle, Video, Briefcase, 
  Send, Instagram, ListOrdered, Hash, Gamepad2, 
  PhoneCall, Smartphone, AtSign, Mailbox, Table, 
  Music, Mic, Voicemail, MessageSquare, Shield, 
  Calendar, Target, Lock 
} from 'lucide-react';

// Safely map string icon names from our schema to actual Lucide components
const IconMap: Record<string, React.FC<any>> = {
  Mail, Sparkles, MessageSquareReply, RefreshCw, Inbox,
  Linkedin: Users, // Fallback for removed brand icons
  Twitter, MessageCircle, Video, Briefcase,
  Send, Instagram, ListOrdered, Hash, Gamepad2,
  PhoneCall, Smartphone, AtSign, Mailbox, Table,
  Music, Mic, Voicemail, MessageSquare, Shield,
  Users, Calendar, Target
};

interface ModeDockProps {
  selectedModeId: string;
  onSelectMode: (modeId: string) => void;
  canAccessMode: (tier: PlanTier) => boolean;
  onUpgradeClick: () => void;
}

export default function ModeDock({
  selectedModeId,
  onSelectMode,
  canAccessMode,
  onUpgradeClick
}: ModeDockProps) {
  
  // Group modes by their tier for organized UI
  const starterModes = MODES.filter(m => m.tier === 'starter');
  const growthModes = MODES.filter(m => m.tier === 'growth');
  const enterpriseModes = MODES.filter(m => m.tier === 'enterprise');

  const renderModeGroup = (title: string, modes: typeof MODES) => (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        padding: '0 16px',
        marginBottom: '8px',
        fontSize: '11px',
        fontWeight: 600,
        color: '#6e6e73',
        textTransform: 'uppercase',
        letterSpacing: '0.8px'
      }}>
        {title}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {modes.map((mode) => {
          const isSelected = selectedModeId === mode.id;
          const isLocked = !canAccessMode(mode.tier);
          const IconComponent = IconMap[mode.iconName] || MessageSquare; // Fallback

          return (
            <button
              key={mode.id}
              onClick={() => {
                if (isLocked) {
                  onUpgradeClick();
                } else {
                  onSelectMode(mode.id);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                background: isSelected ? '#1c1c1e' : 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                opacity: isLocked ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (!isSelected) e.currentTarget.style.background = '#141415';
              }}
              onMouseOut={(e) => {
                if (!isSelected) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ 
                color: isSelected ? '#0a84ff' : (isLocked ? '#6e6e73' : '#a1a1a6'),
                display: 'flex',
                alignItems: 'center'
              }}>
                <IconComponent size={18} />
              </div>
              
              <div style={{ 
                flex: 1, 
                color: isSelected ? '#ffffff' : (isLocked ? '#8e8e93' : '#d1d1d6'),
                fontSize: '14px',
                fontWeight: isSelected ? 500 : 400
              }}>
                {mode.name}
              </div>

              {isLocked && (
                <Lock size={14} color="#6e6e73" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div 
      className="hide-scrollbar"
      style={{
        width: '260px',
        height: '100%',
        overflowY: 'auto',
        borderRight: '1px solid #2a2a2c',
        backgroundColor: '#0a0a0a',
        padding: '20px 12px',
        flexShrink: 0
      }}
    >
      {renderModeGroup("Starter ($19/mo)", starterModes)}
      {renderModeGroup("Growth ($39/mo)", growthModes)}
      {renderModeGroup("Enterprise ($79/mo)", enterpriseModes)}
    </div>
  );
}