import React, { useState } from "react";
import { chatWithGemini } from "./Gemini.js";
import "./ResumeBot.css";

export default function ChatMini() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setReply("");
    try {
      const res = await chatWithGemini(input);
      setReply(res);
    } catch (err) {
      console.error(err);
      setError("送信中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rb-page">
      <div className="rb-card" role="region" aria-label="AI チャット">
        <div className="rb-header">
          <div className="rb-badge" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2L20 6v6c0 6-8 10-8 10S4 14 4 8V6l8-4z" fill="#1976d2" />
            </svg>
          </div>
          <div>
            <div className="rb-title">Resume Bot</div>
            <div className="rb-sub">質問を入力して、AIから応答を受け取ります</div>
          </div>
        </div>

        <form onSubmit={handleSend}>
          <textarea
            aria-label="メッセージ入力"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例: 職務経歴書を要約して。"
            className="rb-textarea"
          />

          <div className="rb-controls">
            <button
              type="submit"
              disabled={loading}
              className="rb-primary"
              aria-disabled={loading}
            >
              {loading && <span className="rb-spinner" aria-hidden />}
              {loading ? "送信中…" : "送信"}
            </button>

            <button
              type="button"
              onClick={() => { setInput(""); setReply(""); setError(""); }}
              className="rb-secondary"
            >
              クリア
            </button>

            <div style={{ marginLeft: "auto" }} className="rb-hint">
              <span style={{ color: "#1976d2", fontWeight: 600 }}>ヒント:</span> 簡潔に要望を書くと良い結果が得られます
            </div>
          </div>
        </form>

        <div className="rb-reply" aria-live="polite">
          {error ? <div className="rb-error">{error}</div> : (reply ? reply : <span style={{ color: "#7b8a9e" }}>AIの応答がここに表示されます</span>)}
        </div>
      </div>
    </div>
  );
}