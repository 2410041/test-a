import React, { useState, useRef } from 'react';

export default function ReplyForm({ contactId, onReplySubmit, useTestData }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('返信内容を入力してください');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await onReplySubmit(message);
      
      // 成功後にメッセージをクリア
      setMessage('');  // ← コメント解除
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // フォームの位置にスクロール
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      console.error('返信送信エラー:', err);
      setError(err.message || '返信の送信に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form ref={formRef} className="reply-form" onSubmit={handleSubmit}>
      <h3>返信を送信</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="返信内容を入力してください"
        disabled={submitting}
        rows={5}
      />
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">返信を送信しました</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? '送信中...' : '返信を送信'}
      </button>
    </form>
  );
}