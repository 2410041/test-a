import React, { useEffect, useState } from 'react';
import './C_Applicant.css';
import HamburgerMenu from '../../components/C_Header/C_Header';
import axios from 'axios';

const C_Applicant = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [modalStatus, setModalStatus] = useState('');

  const statusOptions = ['新規', '書類選考中', '面接予定', '内定', '不採用'];

  useEffect(() => {
    let mounted = true;
    const fetchApplicants = async () => {
      try {
        const res = await axios.get('http://15.152.5.110:3030/applicants', { withCredentials: true });
        if (!mounted) return;
        // サーバーから来る行は application_id, user fields, etc. を含む
        const rows = Array.isArray(res.data) ? res.data : (res.data.applicants || []);
        const mapped = rows.map(r => ({
          id: r.application_id || r.id,
          user_id: r.user_id,
          name: `${r.u_Fname || ''} ${r.u_Lname || ''}`.trim(),
          email: r.u_Email || r.email,
          phone: r.u_Contact || r.phone,
          applied_at: r.applied_at,
          status: r.status || '新規',
          resume_link: r.resume_link || null,
          profile: null,
        }));
        setApplicants(mapped);
      } catch (e) {
        // フォールバック: モックデータを表示
        console.warn('applicants fetch failed, falling back to mock data', e.message);
        if (!mounted) return;
        setApplicants([
          { id: 1, name: '山田 太郎', email: 'taro@example.com', applied_at: '2025-11-01', status: '新規' },
          { id: 2, name: '佐藤 花子', email: 'hanako@example.com', applied_at: '2025-10-28', status: '書類選考中' },
          { id: 3, name: '鈴木 一郎', email: 'ichiro@example.com', applied_at: '2025-10-30', status: '面接予定' },
        ]);
        setError('応募者一覧の取得に失敗しました（モックを表示しています）');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchApplicants();
    return () => { mounted = false; };
  }, []);

  // selectedApplicant が変わったらモーダル用の一時 status をセット
  useEffect(() => {
    if (selectedApplicant) {
      setModalStatus(selectedApplicant.status || '新規');
    } else {
      setModalStatus('');
    }
  }, [selectedApplicant]);

  // ステータス更新をサーバへ送る
  const updateStatus = async () => {
    if (!selectedApplicant) return;
    const id = selectedApplicant.id;
    try {
      const res = await axios.patch(`http://15.152.5.110:3030/applicants/${id}`, { status: modalStatus }, { withCredentials: true });
      // 更新成功したらローカル state を更新
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: modalStatus } : a));
      setSelectedApplicant(prev => prev ? { ...prev, status: modalStatus } : prev);
      alert(res.data?.message || 'ステータスを更新しました');
    } catch (err) {
      console.error('status update failed', err);
      alert('ステータス更新に失敗しました: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = applicants.filter(a => {
    if (filterStatus && filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  return (
    <>
      <HamburgerMenu />
      <div className="cap-container">
        <h2 className="cap-title">応募者一覧</h2>

        <div className="cap-controls">
          <select className="cap-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">全て</option>
            <option value="新規">新規</option>
            <option value="書類選考中">書類選考中</option>
            <option value="面接予定">面接予定</option>
            <option value="内定">内定</option>
          </select>
        </div>

        {loading ? (
          <div className="cap-loading">読み込み中…</div>
        ) : (
          <>
            {error && <div className="cap-error">{error}</div>}
            <div className="cap-table_wrap">
              <table className="cap-table">
                <thead>
                  <tr>
                    <th>応募者名</th>
                    <th>メール</th>
                    <th>応募日</th>
                    <th>ステータス</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center' }}>該当する応募者はいません</td></tr>
                  ) : (
                    filtered.map(a => (
                      <tr key={a.id}>
                        <td>{a.name}</td>
                        <td>{a.email}</td>
                        <td>{a.applied_at}</td>
                        <td>{a.status}</td>
                        <td><button className="cap-button" onClick={() => { setSelectedApplicant(a); setModalOpen(true); }}>詳細</button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {/* モーダル */}
      {modalOpen && selectedApplicant && (
        <div className="cap-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="cap-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="cap-modal-close" onClick={() => setModalOpen(false)}>&times;</button>
            <h3 className="cap-modal-title">応募者詳細</h3>
            <div className="cap-modal-body">
              <p><strong>名前:</strong> {selectedApplicant.name}</p>
              <p><strong>メール:</strong> {selectedApplicant.email}</p>
              <p><strong>応募日:</strong> {selectedApplicant.applied_at}</p>
              <div style={{ marginTop: 8 }}>
                <label style={{ fontWeight: 700, display: 'block', marginBottom: 6 }}>ステータス</label>
                <select value={modalStatus} onChange={e => setModalStatus(e.target.value)} style={{ padding: '8px', borderRadius: 6 }}>
                  {statusOptions.map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              {/* 任意フィールド: 電話や自己PR、添付などがある場合は表示 */}
              {selectedApplicant.phone && <p><strong>電話:</strong> {selectedApplicant.phone}</p>}
              {selectedApplicant.resume_link && (
                <p><strong>履歴書:</strong> <a href={selectedApplicant.resume_link} target="_blank" rel="noreferrer">ダウンロード/表示</a></p>
              )}
              {selectedApplicant.profile && (
                <div className="cap-modal-profile">
                  <h4>プロフィール</h4>
                  <div>{selectedApplicant.profile}</div>
                </div>
              )}
            </div>
            <div className="cap-modal-actions">
              <button className="cap-button" onClick={updateStatus} style={{ background: '#0b63d6' }}>保存</button>
              <button className="cap-button" onClick={() => { setModalOpen(false); /* 将来的に詳細ページへ遷移など */ }}>閉じる</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default C_Applicant;
