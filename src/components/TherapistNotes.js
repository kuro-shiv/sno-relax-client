import React, { useState, useEffect, useRef } from "react";
import API_BASE, { API_ENDPOINTS } from "../config/api.config";

export default function TherapistNotes() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiGuide, setAiGuide] = useState(null);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const stepTimerRef = useRef(null);
  const messagesRef = useRef(null);
  const textareaRef = useRef(null);

  const userId =
    localStorage.getItem("sno_userId") || localStorage.getItem("userId") || `guest_${Math.random().toString(36).slice(2,7)}`;

  // Fetch private messages for this user
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/private/messages?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (data && data.messages) setMessages((data.messages || []).slice().sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (e) {
      console.error("Failed to load private messages:", e.message);
    }
  };

  useEffect(() => {
    fetchMessages();
    // request AI guide from backend
    requestAiGuide();
    // attempt to listen for socket events would be optional; left as future improvement
    // autofocus textarea
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  // scroll to bottom when messages update
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const requestAiGuide = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ai/guide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.ok && data.guide) setAiGuide(data.guide);
    } catch (e) {
      console.error('AI guide request failed:', e.message);
    }
  };

  // Guided routine player (no third-party)
  const parseDurationSeconds = (stepText) => {
    // look for patterns like "1 min" or "30s" or "45 sec"
    const mMin = stepText.match(/(\d+)\s*min/);
    if (mMin) return parseInt(mMin[1], 10) * 60;
    const mSec = stepText.match(/(\d+)\s*s(ec)?/);
    if (mSec) return parseInt(mSec[1], 10);
    // if step includes a dash with number after (e.g., "Child pose - 1 min")
    const mDash = stepText.match(/-\s*(\d+)\s*min/);
    if (mDash) return parseInt(mDash[1], 10) * 60;
    return 10; // default demo seconds
  };

  const startRoutine = (routine) => {
    stopRoutine();
    setCurrentRoutine(routine);
    setCurrentStep(0);
    const initial = parseDurationSeconds(routine.steps[0] || '');
    setCountdown(initial);
    stepTimerRef.current = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
  };

  const stopRoutine = () => {
    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }
    setCurrentRoutine(null);
    setCurrentStep(0);
    setCountdown(0);
  };

  // Advance step when countdown hits 0
  useEffect(() => {
    if (!currentRoutine) return;
    if (countdown === 0) {
      // move to next step
      const next = currentStep + 1;
      if (next < (currentRoutine.steps || []).length) {
        setCurrentStep(next);
        const dur = parseDurationSeconds(currentRoutine.steps[next] || '');
        setCountdown(dur);
      } else {
        // routine finished
        stopRoutine();
      }
    }
  }, [countdown]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const payload = { senderId: userId, receiverId: "admin", message: input.trim() };
      const res = await fetch(`${API_BASE}/api/private/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setInput("");
        await fetchMessages();
        if (textareaRef.current) textareaRef.current.focus();
      } else {
        console.error("Failed to send message");
      }
    } catch (e) {
      console.error("Send message error:", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && input.trim()) sendMessage();
    }
  };


  const formatTime = (s) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  return (
    <div className="therapist-notes">
      <div style={{ marginBottom: 16 }}>
        <h3>Private chat with Admin</h3>
        <p style={{ color: "#555" }}>Send a private message to the admin/therapist. They can reply from the admin panel.</p>
      </div>

      <div ref={messagesRef} className="messages-list" style={{ maxHeight: 360, overflowY: "auto", marginBottom: 12, paddingRight: 8 }}>
        {messages.length === 0 ? (
          <p className="empty">No messages yet. Send a message to start a conversation.</p>
        ) : (
          messages.map((m) => {
            const isMine = m.senderId === userId;
            return (
              <div key={m._id || m.createdAt || Math.random()} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                <div style={{ maxWidth: '78%', padding: 10, borderRadius: 12, background: isMine ? '#e6f0ff' : '#f3f4f6' }}>
                  <div style={{ fontSize: 14, color: '#111', marginBottom: 6 }}>{m.message}</div>
                  <small style={{ color: '#666' }}>{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''} • <strong>{isMine ? 'You' : 'Admin'}</strong></small>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="note-input" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <textarea ref={textareaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} aria-label="Private message to admin" placeholder="Type a private message to admin..." style={{ width: '100%', minHeight: 80, padding: 10, borderRadius: 8 }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={sendMessage} className="btn" disabled={loading || !input.trim()}>{loading ? 'Sending...' : 'Send'}</button>
        </div>
      </div>

      <hr style={{ margin: "18px 0" }} />

      <div>
        <h4>AI Therapist Guide</h4>
        {aiGuide ? (
          <div style={{ padding: 12, background: aiGuide.level === "severe" ? "#ffe4e6" : "#f0f9ff", borderRadius: 8 }}>
            <p style={{ margin: 0 }}>{aiGuide.text || aiGuide.summary}</p>
            {/* recommendations is expected to be an array of recommendation objects: { title, steps: [string], notes } */}
            {aiGuide.recommendations && aiGuide.recommendations.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <h5 style={{ margin: '6px 0' }}>Recommendations</h5>
                <div style={{ display: 'grid', gap: 8 }}>
                  {aiGuide.recommendations.map((r, idx) => (
                    <div key={idx} style={{ padding: 10, borderRadius: 6, background: '#fff', border: '1px solid #e6e6e6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{r.title || `Routine ${idx+1}`}</strong>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => startRoutine(r)} className="btn small">Start</button>
                        </div>
                      </div>
                      {r.notes && <div style={{ marginTop: 6, color: '#555' }}>{r.notes}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: "#666" }}>Analyzing recent chat history...</p>
        )}

        {/* Routine player UI */}
        {currentRoutine && (
          <div style={{ marginTop: 12, padding: 12, background: '#f9fafb', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Running: {currentRoutine.title || 'Routine'}</strong>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={stopRoutine} className="btn small outline">Stop</button>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 14, color: '#333' }}>Step {currentStep + 1} of {currentRoutine.steps.length}</div>
              <div style={{ marginTop: 6, padding: 10, background: '#fff', borderRadius: 6 }}>{currentRoutine.steps[currentStep]}</div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontWeight: 600 }}>{formatTime(countdown)}</div>
                <div>
                  <button onClick={() => {
                    // skip to next
                    setCountdown(0);
                  }} className="btn small">Next</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
