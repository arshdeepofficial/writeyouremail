"use client";

// app/studio/components/DynamicForm.tsx
import React from 'react';
import { MODES } from '../lib/modeSchemas';
import { Sparkles, Loader2 } from 'lucide-react';

interface DynamicFormProps {
  modeId: string;
  formData: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isGenerating: boolean;
  hasCredits: boolean;
}

export default function DynamicForm({
  modeId,
  formData,
  onChange,
  onSubmit,
  isGenerating,
  hasCredits
}: DynamicFormProps) {
  const currentMode = MODES.find((m) => m.id === modeId);

  if (!currentMode) {
    return (
      <div style={{ padding: '24px', color: '#8e8e93', textAlign: 'center' }}>
        Please select an outreach mode from the dock.
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: '#1c1c1e',
    border: '1px solid #2a2a2c',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '15px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  return (
    <form 
      onSubmit={onSubmit} 
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: 600, color: '#ffffff' }}>
          {currentMode.name}
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#8e8e93' }}>
          {currentMode.description}
        </p>
      </div>

      {currentMode.fields.map((field) => (
        <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label 
            htmlFor={field.id}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#a1a1a6',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {field.label} {field.required && <span style={{ color: '#ff453a' }}>*</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isGenerating}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '120px',
                lineHeight: '1.5'
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0a84ff')}
              onBlur={(e) => (e.target.style.borderColor = '#2a2a2c')}
            />
          ) : field.type === 'select' ? (
            <div style={{ position: 'relative' }}>
              <select
                id={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                required={field.required}
                disabled={isGenerating}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  cursor: 'pointer'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0a84ff')}
                onBlur={(e) => (e.target.style.borderColor = '#2a2a2c')}
              >
                <option value="" disabled>Select an option...</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#8e8e93'
              }}>
                ▼
              </div>
            </div>
          ) : (
            <input
              type="text"
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isGenerating}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#0a84ff')}
              onBlur={(e) => (e.target.style.borderColor = '#2a2a2c')}
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isGenerating || !hasCredits}
        style={{
          marginTop: '12px',
          width: '100%',
          padding: '16px',
          borderRadius: '14px',
          border: 'none',
          background: (!hasCredits) 
            ? '#2a2a2c' 
            : 'linear-gradient(135deg, #0a84ff, #005bb5)',
          color: (!hasCredits) ? '#8e8e93' : '#ffffff',
          fontSize: '16px',
          fontWeight: 600,
          cursor: (isGenerating || !hasCredits) ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: (!hasCredits || isGenerating) 
            ? 'none' 
            : '0 8px 20px rgba(10, 132, 255, 0.3)',
          transition: 'all 0.2s ease',
          opacity: isGenerating ? 0.8 : 1
        }}
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Writing...
          </>
        ) : !hasCredits ? (
          "No Credits Remaining"
        ) : (
          <>
            <Sparkles size={20} />
            Generate Magic
          </>
        )}
      </button>
    </form>
  );
}