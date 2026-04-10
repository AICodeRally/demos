'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePrizymTheme } from '../ThemeProvider';

const FORGE_API = 'https://forge.aicoderally.com/api/widget'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const STARTER_QUESTIONS = [
  'What are the 8 Levers of SPM?',
  'How should I handle clawbacks?',
  'What makes a good comp plan?',
  'How do I assess governance maturity?',
]

interface Props {
  /** Fill available height (for full-page mode) */
  fullHeight?: boolean
}

export function AskSGMChat({ fullHeight }: Props) {
  const { theme } = usePrizymTheme();
  const isDark = theme === 'dark';
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const msgCounter = useRef(0)

  const C = {
    bg: isDark ? '#0f172a' : '#ffffff',
    surface: isDark ? '#1e293b' : '#f8fafc',
    text: isDark ? '#f1f5f9' : '#0f172a',
    muted: isDark ? '#cbd5e1' : '#334155',
    border: isDark ? '#334155' : '#e2e8f0',
    userBubble: '#6366f1',
    assistantBubble: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
    inputBg: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
  }

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Start Forge session on mount
  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const res = await fetch(`${FORGE_API}/session/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packId: 'spm', mode: 'ask' }),
        })
        if (!res.ok) {
          if (!cancelled) setError('Failed to connect to AskSGM')
          return
        }
        const data = await res.json() as { session: { id: string } }
        if (!cancelled) setSessionId(data.session.id)
      } catch {
        if (!cancelled) setError('Failed to connect to AskSGM')
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  const sendMessage = useCallback(async () => {
    const content = input.trim()
    if (!content || !sessionId || isStreaming) return

    const userMsg: Message = {
      id: `msg_${++msgCounter.current}`,
      role: 'user',
      content,
    }

    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setIsStreaming(true)
    setError(null)

    try {
      const res = await fetch(`${FORGE_API}/session/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        setError('Message failed. Try again.')
        setIsStreaming(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setError('No response stream')
        setIsStreaming(false)
        return
      }

      const decoder = new TextDecoder()
      let assistantContent = ''
      const assistantId = `msg_${++msgCounter.current}`

      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6))
              if (event.type === 'text-delta' && event.delta) {
                assistantContent += event.delta
                setMessages(prev =>
                  prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
                )
              }
            } catch { /* skip malformed */ }
            continue
          }
          if (line.startsWith('0:')) {
            try {
              const text = JSON.parse(line.slice(2))
              if (typeof text === 'string') {
                assistantContent += text
                setMessages(prev =>
                  prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
                )
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch {
      setError('Connection lost. Try again.')
    } finally {
      setIsStreaming(false)
      inputRef.current?.focus()
    }
  }, [input, sessionId, isStreaming, messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetSession = () => {
    setMessages([])
    setSessionId(null)
    setError(null)
    // Re-init session
    fetch(`${FORGE_API}/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packId: 'spm', mode: 'ask' }),
    })
      .then(r => r.json())
      .then((data: any) => setSessionId(data.session.id))
      .catch(() => setError('Failed to reconnect'))
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: fullHeight ? '100%' : 520,
      background: C.bg,
      borderRadius: fullHeight ? 0 : 12,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: sessionId ? '#22c55e' : '#94a3b8',
        }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>AskSGM</span>
        <span style={{ fontSize: 14, color: C.muted }}>AI-powered SPM advisor</span>
        {messages.length > 0 && (
          <button
            onClick={resetSession}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              color: C.muted,
              padding: 4,
            }}
            title="New conversation"
          >
            &#x21bb;
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {messages.length === 0 && !error && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            textAlign: 'center',
            padding: '0 16px',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: isDark ? 'rgba(79,70,229,0.15)' : '#eef2ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              fontSize: 28,
            }}>
              &#x1F4AC;
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>
              Ask anything about SPM
            </div>
            <div style={{ fontSize: 16, color: C.muted, maxWidth: 320, marginBottom: 24 }}>
              Compensation plans, governance, vendor evaluation, operations, and policy design.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {STARTER_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 0) }}
                  style={{
                    fontSize: 14,
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: `1px solid ${C.border}`,
                    background: 'transparent',
                    color: C.text,
                    cursor: 'pointer',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            {msg.role === 'user' ? (
              <div style={{
                maxWidth: '80%',
                padding: '10px 16px',
                borderRadius: '16px 16px 4px 16px',
                fontSize: 15,
                color: '#ffffff',
                background: C.userBubble,
              }}>
                {msg.content}
              </div>
            ) : (
              <div style={{ maxWidth: '90%' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  fontSize: 15,
                  color: C.text,
                  background: C.assistantBubble,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content || (
                    <span style={{ color: C.muted, fontStyle: 'italic' }}>Thinking...</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {error && (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 14, color: '#ef4444' }}>{error}</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '8px 16px 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8,
          borderRadius: 12,
          padding: '10px 14px',
          border: `1px solid ${C.border}`,
          background: C.inputBg,
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={sessionId ? 'Ask about SPM...' : 'Connecting...'}
            disabled={!sessionId || isStreaming}
            rows={1}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: 15,
              color: C.text,
              maxHeight: 120,
              fontFamily: 'inherit',
              opacity: (!sessionId || isStreaming) ? 0.5 : 1,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !sessionId || isStreaming}
            style={{
              padding: 8,
              borderRadius: 8,
              border: 'none',
              background: '#6366f1',
              cursor: 'pointer',
              opacity: (!input.trim() || !sessionId || isStreaming) ? 0.3 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div style={{ fontSize: 14, color: C.muted, textAlign: 'center', marginTop: 8 }}>
          Powered by Forge &middot; Responses are AI-generated
        </div>
      </div>
    </div>
  )
}
