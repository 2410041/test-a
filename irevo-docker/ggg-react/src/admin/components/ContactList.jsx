import React from 'react';

export default function ContactList({ 
  contacts, 
  selectedContact, 
  onSelectContact, 
  loading, 
  onRefresh 
}) {
  return (
    <div className="contact-list">
      <div className="contact-list-items">
        {contacts.length === 0 ? (
          <div className="contact-list-empty">
            <p className="empty-icon">📭</p>
            <p className="empty-text">お問い合わせはありません</p>
          </div>
        ) : (
          contacts.map(contact => (
            <div
              key={contact.id}
              className={`contact-list-item ${selectedContact?.id === contact.id ? 'active' : ''}`}
              onClick={() => onSelectContact(contact)}
            >
              <div className="contact-item-status">
                <span className={`status-badge ${contact.status || 'new'}`}>
                  {contact.status === 'replied' ? '✓' : '●'}
                </span>
              </div>
              <div className="contact-item-content">
                <div className="contact-item-header">
                  <span className="contact-user-name">{contact.userName}</span>
                  <span className={`contact-status ${contact.status || 'new'}`}>
                    {contact.status === 'replied' ? '返信済み' : '新規'}
                  </span>
                </div>
                <p className="contact-subject">{contact.subject}</p>
                <p className="contact-date">
                  {new Date(contact.createdAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}