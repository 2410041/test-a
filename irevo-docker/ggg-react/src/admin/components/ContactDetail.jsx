import React, { useState, useEffect, useRef } from 'react';
import ReplyForm from './ReplyForm';

export default function ContactDetail({ contact, replies = [], onReplySuccess, onReplyDeleted, useTestData }) {
  const [localReplies, setLocalReplies] = useState(replies);
  const prevContactIdRef = useRef(null);

  useEffect(() => {
    // contact が変わった時だけ replies をリセット
    if (prevContactIdRef.current !== contact?.id) {
      setLocalReplies(replies);
      prevContactIdRef.current = contact?.id;
    } else if (replies.length > 0 && localReplies.length === 0) {
      // ← 同じ contact で replies が入ってきたら更新（ページロード後）
      setLocalReplies(replies);
    }
  }, [contact?.id, replies]);

  const handleDeleteReply = async (replyId) => {
    if (!confirm('この返信を削除してもよろしいですか？')) return;

    try {
      const response = await fetch(`http://localhost:3030/contact/contactReplies/${replyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('削除失敗');

      // ローカル状態から削除
      setLocalReplies(localReplies.filter(r => r.id !== replyId));
      
      // 親に削除を通知
      if (onReplyDeleted) {
        onReplyDeleted();
      }
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    }
  };

  const handleReplySubmit = async (replyMessage) => {
    if (useTestData) {
      const newReply = {
        id: Math.max(...localReplies.map(r => r.id), 0) + 1,
        contactId: contact.id,
        message: replyMessage,
        createdAt: new Date().toISOString(),
      };
      setLocalReplies([...localReplies, newReply]);
    } else {
      try {
        const response = await fetch('http://localhost:3030/contact/contactReplies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contactId: contact.id,
            message: replyMessage,
          }),
        });

        if (!response.ok) throw new Error('返信送信失敗');

        const newReply = await response.json();
        setLocalReplies([...localReplies, newReply]);
      } catch (error) {
        console.error('返信送信エラー:', error);
        alert('返信の送信に失敗しました');
        return;
      }
    }
    
    onReplySuccess();
  };

  if (!contact) return null;

  return (
    <div className="contact-detail">
      <div className="contact-detail-header">
        <div className="detail-header-left">
          <h2>{contact.subject}</h2>
          <span className={`detail-status ${contact.status || 'new'}`}>
            {contact.status === 'replied' ? '✓ 返信済み' : '● 未返信'}
          </span>
        </div>
      </div>

      <div className="contact-detail-info">
        <div className="info-grid">
          <div className="info-item">
            <label>ユーザー名</label>
            <p>{contact.userName}</p>
          </div>
          <div className="info-item">
            <label>メールアドレス</label>
            <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
          </div>
          <div className="info-item">
            <label>送信日時</label>
            <p>{new Date(contact.createdAt).toLocaleString('ja-JP')}</p>
          </div>
        </div>
      </div>

      <div className="contact-detail-message">
        <h3>お問い合わせ内容</h3>
        <div className="message-box user-message">
          <p>{contact.message}</p>
        </div>
      </div>

      <div className="contact-replies">
        <h3>返信履歴 {localReplies.length > 0 && <span className="reply-count">{localReplies.length}</span>}</h3>
        {localReplies.length === 0 ? (
          <p className="no-replies">返信はまだありません</p>
        ) : (
          <div className="replies-container">
            {localReplies.map(reply => (
              <div key={reply.id} className="message-box admin-message">
                <div className="reply-header">
                  <p className="reply-author">運営からの返信</p>
                  <button 
                    className="reply-delete-btn"
                    onClick={() => handleDeleteReply(reply.id)}
                    title="この返信を削除"
                  >
                    🗑️
                  </button>
                </div>
                <p className="reply-content">{reply.message}</p>
                <p className="reply-date">
                  {new Date(reply.createdAt).toLocaleString('ja-JP')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReplyForm
        contactId={contact.id}
        onReplySubmit={handleReplySubmit}
        useTestData={useTestData}
      />
    </div>
  );
}