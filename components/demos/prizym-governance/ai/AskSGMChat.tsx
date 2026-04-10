'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getCannedResponse } from './askSgmFallbacks';

const FORGE_API = 'https://forge.aicoderally.com/api/widget'

type ConnectionMode = 'connecting' | 'live' | 'fallback'

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
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [mode, setMode] = useState<ConnectionMode>('connecting')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const msgCounter = useRef(0)

  // Colors come from prizym-governance.css tokens so chat inherits the
  // glass/dark theme in both modes instead of hardcoding hex values.
  const C = {
    bg: 'var(--pg-card)',
    surface: 'var(--pg-surface-alt)',
    text: 'var(--pg-text)',
    muted: 'var(--pg-text-muted)',
    border: 'var(--pg-border)',
    userBubble: '#6366f1',
    assistantBubble: 'var(--pg-surface-alt)',
    inputBg: 'var(--pg-surface-alt)',
  }

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Start Forge session on mount; fall back to canned responses if unreachable
  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const res = await fetch(`${FORGE_API}/session/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packId: 'spm', mode: 'ask' }),
        })
        if (!res.ok) throw new Error('bad response')
        const data = await res.json() as { session: { id: string } }
        if (cancelled) return
        setSessionId(data.session.id)
        setMode('live')
      } catch {
        if (cancelled) return
        setMode('fallback')
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  const sendMessage = useCallback(async () => {
    const content = input.trim()
    if (!content || isStreaming) return
    if (mode === 'connecting') return

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

    // Fallback mode: simulate a typed response from canned knowledge base
    if (mode === 'fallback' || !sessionId) {
      const cannedContent = getCannedResponse(content)
      const assistantId = `msg_${++msgCounter.current}`
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }])
      let streamed = ''
      const words = cannedContent.split(' ')
      for (let i = 0; i < words.length; i++) {
        streamed += (i === 0 ? '' : ' ') + words[i]
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: streamed } : m)
        )
        await new Promise(r => setTimeout(r, 12))
      }
      setIsStreaming(false)
      inputRef.current?.focus()
      return
    }

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
  }, [input, sessionId, isStreaming, messages, mode])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const resetSession = () => {
    setMessages([])
    setError(null)
    if (mode === 'fallback') return // nothing to reset in fallback
    setSessionId(null)
    setMode('connecting')
    fetch(`${FORGE_API}/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packId: 'spm', mode: 'ask' }),
    })
      .then(r => {
        if (!r.ok) throw new Error('bad response')
        return r.json()
      })
      .then((data: { session: { id: string } }) => {
        setSessionId(data.session.id)
        setMode('live')
      })
      .catch(() => setMode('fallback'))
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
          background: mode === 'live' ? '#22c55e' : mode === 'fallback' ? '#f59e0b' : '#94a3b8',
        }} />
        <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>AskSGM</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: '2px 10px',
            borderRadius: 999,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background:
              mode === 'live'
                ? 'rgba(34,197,94,0.18)'
                : mode === 'fallback'
                ? 'rgba(245,158,11,0.18)'
                : 'rgba(148,163,184,0.18)',
            color:
              mode === 'live' ? '#6ee7b7' : mode === 'fallback' ? '#fcd34d' : '#cbd5e1',
            border: `1px solid ${
              mode === 'live'
                ? 'rgba(34,197,94,0.5)'
                : mode === 'fallback'
                ? 'rgba(245,158,11,0.5)'
                : 'rgba(148,163,184,0.3)'
            }`,
          }}
          title={
            mode === 'fallback'
              ? 'Forge API unreachable — running on canned demo responses'
              : mode === 'live'
              ? 'Connected to Forge widget API'
              : 'Connecting to Forge widget API'
          }
        >
          {mode === 'live' ? 'Live' : mode === 'fallback' ? 'Demo Fallback' : 'Connecting'}
        </span>
        <span style={{ fontSize: 14, color: C.muted, marginLeft: 4 }}>SPM advisor</span>
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
              background: 'var(--pg-surface-alt)',
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
            placeholder={
              mode === 'connecting'
                ? 'Connecting...'
                : mode === 'fallback'
                ? 'Ask about SPM (demo fallback)...'
                : 'Ask about SPM...'
            }
            disabled={mode === 'connecting' || isStreaming}
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
              opacity: (mode === 'connecting' || isStreaming) ? 0.5 : 1,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || mode === 'connecting' || isStreaming}
            style={{
              padding: 8,
              borderRadius: 8,
              border: 'none',
              background: '#6366f1',
              cursor: 'pointer',
              opacity: (!input.trim() || mode === 'connecting' || isStreaming) ? 0.3 : 1,
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
          {mode === 'fallback'
            ? 'Demo fallback mode · Canned responses from governance knowledge base'
            : 'Powered by Forge · Responses are AI-generated'}
        </div>
      </div>
    </div>
  )
}
