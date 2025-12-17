import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactList from '../components/ContactList';
import ContactDetail from '../components/ContactDetail';
import { dataProvider } from '../dataProvider';
import '../styles/contact.css';

// テストデータ
const MOCK_CONTACTS = [
  {
    id: 1,
    userName: '山田太郎',
    email: 'yamada@example.com',
    subject: '求人情報について質問があります',
    message: 'こちらの求人情報について詳しく教えていただきたいのですが、勤務地の詳細情報や給与について教えていただけますでしょうか？よろしくお願いいたします。',
    status: 'replied',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    userName: '佐藤花子',
    email: 'sato.hanako@example.com',
    subject: 'アカウント作成がうまくいきません',
    message: 'アカウント作成時にエラーが発生してしまい、登録ができません。どのように対処すればよいでしょうか？',
    status: 'new',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    userName: '鈴木次郎',
    email: 'suzuki.jiro@example.com',
    subject: 'サービスについての一般的な問い合わせ',
    message: 'このサービスはどのような企業が利用していますか？また、今後拡張予定の機能があれば教えてください。',
    status: 'new',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    userName: '田中美咲',
    email: 'tanaka.misaki@example.com',
    subject: 'プロフィール編集について',
    message: 'プロフィール編集画面でスキルを追加しようとしたのですが、保存されません。何が原因でしょうか？',
    status: 'replied',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    userName: '伊藤健一',
    email: 'ito.kenichi@example.com',
    subject: 'スマートフォンからのアクセスがうまくいきません',
    message: 'スマートフォンからアクセスするとページが崩れてしまいます。改善していただけますでしょうか？',
    status: 'new',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    userName: '高橋由美',
    email: 'takahashi.yumi@example.com',
    subject: 'オファーが届きません',
    message: 'プロフィールを公開してから2週間経っていますが、まだ企業からのオファーが届きません。表示されていないのでしょうか？',
    status: 'replied',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_REPLIES = [
  {
    id: 1,
    contactId: 1,
    message: 'ご問い合わせいただきありがとうございます。勤務地は東京都渋谷区で、給与は応相談となっています。詳細については別途ご連絡させていただきます。',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    contactId: 1,
    message: '追加で、リモートワーク対応も可能です。ご質問があればお気軽にお問い合わせください。',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    contactId: 4,
    message: 'この度はご報告ありがとうございます。システムを確認したところ、スキル追加機能に一時的な不具合が発生していたようです。現在は解決しております。恐れ入りますが、もう一度お試しいただけますでしょうか？',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    contactId: 6,
    message: 'ご利用いただきありがとうございます。プロフィールが企業に正常に表示されているか確認させていただきました。表示されています。多くの企業からのオファーが来ることを願っています。何かご不明な点がございましたら、いつでもお気軽にお問い合わせください。',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function ContactListPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [allReplies, setAllReplies] = useState({});  // ← 全ユーザーの返信を保存（連想配列）
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [useTestData, setUseTestData] = useState(false);

  // fetchContacts を useCallback でメモ化
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3030/contact/contacts?filter=${filter}&search=${searchTerm}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const contactsData = await response.json();
      console.log('取得したデータ:', contactsData);  // ← デバッグ用
      setContacts(contactsData);

      // 各contactの返信を取得
      if (contactsData.length > 0 && contactsData[0].id) {
        const repliesResponse = await fetch(`http://localhost:3030/contact/contactReplies/${contactsData[0].id}`);
        if (!repliesResponse.ok) throw new Error('Failed to fetch replies');
        const repliesData = await repliesResponse.json();
        setAllReplies(repliesData);
      }
    } catch (error) {
      console.error('お問い合わせ一覧の取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]);  // ← 依存配列に追加

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);  // ← fetchContacts を依存配列に追加

  const filteredContacts = contacts.filter(contact => {
    const matchesFilter = filter === 'all' || contact.status === filter;
    const matchesSearch =
      contact.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 特定のお問い合わせをクリックした時に返信を取得
  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    
    // キャッシュをチェック
    if (allReplies[contact.id] !== undefined) {  // ← undefined チェックに変更
      return;
    }

    try {
      const repliesResponse = await fetch(`http://localhost:3030/contact/contactReplies/${contact.id}`);
      if (!repliesResponse.ok) throw new Error('返信取得失敗');
      const repliesData = await repliesResponse.json();
      
      setAllReplies(prev => ({
        ...prev,
        [contact.id]: repliesData
      }));
    } catch (error) {
      console.error('返信取得エラー:', error);
      setAllReplies(prev => ({
        ...prev,
        [contact.id]: []
      }));
    }
  };

  const handleReplySuccess = async () => {
    if (selectedContact) {
      // Contact の status を 'replied' に更新
      const updatedContact = { ...selectedContact, status: 'replied' };
      setContacts(contacts.map(c =>
        c.id === selectedContact.id ? updatedContact : c
      ));
      setSelectedContact(updatedContact);

      // 返信一覧を再取得
      try {
        const repliesResponse = await fetch(`http://localhost:3030/contact/contactReplies/${selectedContact.id}`);
        if (!repliesResponse.ok) throw new Error('返信取得失敗');
        const repliesData = await repliesResponse.json();
        
        setAllReplies(prev => ({
          ...prev,
          [selectedContact.id]: repliesData
        }));
      } catch (error) {
        console.error('返信取得エラー:', error);
      }
    }
  };

  // 返信削除後（←これを追加）
  const handleReplyDeleted = async () => {
    if (selectedContact) {
      // 返信一覧を再取得
      try {
        const repliesResponse = await fetch(`http://localhost:3030/contact/contactReplies/${selectedContact.id}`);
        if (!repliesResponse.ok) throw new Error('返信取得失敗');
        const repliesData = await repliesResponse.json();
        
        setAllReplies(prev => ({
          ...prev,
          [selectedContact.id]: repliesData
        }));
      } catch (error) {
        console.error('返信取得エラー:', error);
      }
    }
  };

  const newCount = contacts.filter(c => c.status !== 'replied').length;

  return (
    <div className="contact-container">
      <div className="contact-layout">
        <div className="contact-list-section">
          <div className="contact-list-header">
            <div className="list-header-top">
              <h1>お問い合わせ管理</h1>
              <div className="list-header-buttons">
                <span className="contact-badge">{contacts.length}件</span>
                <button className="contact-refresh-btn" onClick={fetchContacts} disabled={loading}>
                  {loading ? '更新中...' : '更新'}
                </button>
                <button className="back-btn" onClick={() => navigate('/Admin')}>
                  ← 戻る
                </button>
              </div>
            </div>
          </div>
          <div className="contact-list-controls">
            <input
              type="text"
              className="contact-search"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="contact-filter-tabs">
              <button
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                すべて<span className="filter-count">{contacts.length}</span>
              </button>
              <button
                className={`filter-tab ${filter === 'new' ? 'active' : ''}`}
                onClick={() => setFilter('new')}
              >
                未返信<span className="filter-count highlight">{newCount}</span>
              </button>
              <button
                className={`filter-tab ${filter === 'replied' ? 'active' : ''}`}
                onClick={() => setFilter('replied')}
              >
                返信済み<span className="filter-count">{contacts.filter(c => c.status === 'replied').length}</span>
              </button>
            </div>
          </div>
          <ContactList
            contacts={filteredContacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            loading={loading}
            onRefresh={fetchContacts}
          />
        </div>
        <div className="contact-detail-section">
          {selectedContact ? (
            <ContactDetail
              contact={selectedContact}
              replies={allReplies[selectedContact.id] || []}  // ← allReplies から取得
              onReplySuccess={handleReplySuccess}
              onReplyDeleted={handleReplyDeleted}  // ← 追加
              useTestData={useTestData}
            />
          ) : (
            <div className="no-selection-container">
              <div className="no-selection-icon">📋</div>
              <p className="no-selection-text">お問い合わせを選択してください</p>
              <p className="no-selection-hint">左側のリストからお問い合わせを選択すると、詳細が表示されます</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}