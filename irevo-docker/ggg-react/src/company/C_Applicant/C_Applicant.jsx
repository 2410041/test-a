import React, { useEffect, useState } from 'react';
import './C_Applicant.css';
import HamburgerMenu from '../../components/C_Header/C_Header';
import axios from 'axios';
import Userinfo from '../../components/Userinfo/Userinfo.jsx';

const C_Applicant = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [updatingIds, setUpdatingIds] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState('');
  const [showMypageModal, setShowMypageModal] = useState(false);

  const statusOptions = ['新規', '書類選考中', '面接予定', '内定', '不採用'];

  useEffect(() => {
    let mounted = true;
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3030/applicant',
          { withCredentials: true }
        );
        if (!mounted) return;

        const rows = res.data?.data || [];
        
        const mapped = rows.map(row => ({
          id: row.application_id || row.id,
          user_id: row.user_id,
          name: `${row.u_Fname || ''} ${row.u_Lname || ''}`.trim(),
          email: row.u_Email || row.email,
          phone: row.u_Contact || row.phone,
          applied_at: row.applied_at,
          status: row.status || '新規',
          resume_link: row.resume_link || null,
          // include user profile fields returned by the JOIN so modal can show full MyPage-like info
          profile: {
            u_nick: row.u_nick,
            u_Fname: row.u_Fname,
            u_Lname: row.u_Lname,
            u_kana: row.u_kana,
            Birthday: row.Birthday,
            Gender: row.Gender,
            u_Contact: row.u_Contact,
            u_Address: row.u_Address,
            u_Email: row.u_Email,
            Employment: row.Employment,
          }
        }));

        setApplicants(mapped);
      } catch (error) {
        console.warn('applicants fetch failed, falling back to mock data', error.message);
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
  // モーダルからの個別ステータス変更は無効化（一覧で一括変更してください）
  // updateStatus 関数は削除しました。

  const filtered = applicants.filter(applicant => {
    if (filterStatus !== 'all' && applicant.status !== filterStatus) return false;
    return true;
  });

  return (
    <>
      <HamburgerMenu />
      <div className="cap-container">
        <h2 className="cap-title">応募者一覧</h2>

        <div className="cap-controls">
          <select
            className="cap-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="all">全て</option>
            {statusOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* 一括操作UI */}
          <div style={{ display: 'inline-flex', gap: 8, marginLeft: 12, alignItems: 'center' }}>
            <select id="bulkStatusSelect" defaultValue="書類選考中" className="cap-select">
              {statusOptions.map(statusOption => (
                <option key={statusOption} value={statusOption}>{statusOption}</option>
              ))}
            </select>

            <button
              className="cap-button"
              onClick={async () => {
                const sel = selectedIds.slice();
                if (sel.length === 0) return alert('まず応募者を選択してください');

                const newStatus = document.getElementById('bulkStatusSelect').value;
                if (!confirm(`${sel.length} 件の応募者のステータスを「${newStatus}」に変更します。よろしいですか？`)) return;

                try {
                  const res = await axios.patch(
                    'http://localhost:3030/applicant',
                    { ids: sel, status: newStatus },
                    { withCredentials: true }
                  );

                  if (res.data?.success) {
                    setApplicants(prev =>
                      prev.map(a => sel.includes(a.id) ? { ...a, status: newStatus } : a)
                    );
                    setSelectedIds([]);
                    alert(`${res.data.affectedRows || sel.length} 件を更新しました`);
                  } else {
                    alert(res.data?.message || '一括更新に失敗しました');
                  }
                } catch (err) {
                  console.error('bulk update failed', err);
                  alert('一括更新に失敗しました');
                }
              }}
            >
              一括更新
            </button>
          </div>
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
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedIds.length === applicants.length && applicants.length > 0}
                        onChange={e =>
                          e.target.checked
                            ? setSelectedIds(applicants.map(a => a.id))
                            : setSelectedIds([])
                        }
                      />
                    </th>
                    <th>応募者名</th>
                    <th>メール</th>
                    <th>就業状態</th>
                    <th>ステータス</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center' }}>該当する応募者はいません</td></tr>
                  ) : (
                    filtered.map(applicant => (
                      <tr key={applicant.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(applicant.id)}
                            onChange={e =>
                              e.target.checked
                                ? setSelectedIds(prev => [...prev, applicant.id])
                                : setSelectedIds(prev => prev.filter(id => id !== applicant.id))
                            }
                          />
                        </td>
                        <td>{applicant.name}</td>
                        <td>{applicant.email}</td>
                        <td>{applicant.profile?.Employment || '-'}</td>
                        <td>
                          <select
                            className="cap-select"
                            value={applicant.status}
                            disabled={updatingIds.includes(applicant.id)}
                            onChange={async e => {
                              const newStatus = e.target.value;

                              setApplicants(prev =>
                                prev.map(a => a.id === applicant.id ? { ...a, status: newStatus } : a)
                              );
                              setUpdatingIds(prev => [...prev, applicant.id]);

                              try {
                                const res = await axios.patch(
                                  `http://localhost:3030/applicant/${applicant.id}`,
                                  { status: newStatus },
                                  { withCredentials: true }
                                );
                                if (!res.data?.success) {
                                  throw new Error('update failed');
                                }
                              } catch (err) {
                                setApplicants(prev =>
                                  prev.map(a => a.id === applicant.id ? { ...a, status: applicant.status } : a)
                                );
                                alert('ステータスの更新に失敗しました');
                              } finally {
                                setUpdatingIds(prev => prev.filter(id => id !== applicant.id));
                              }
                            }}
                          >
                            {statusOptions.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button
                            className="cap-button"
                            onClick={() => {
                              setSelectedApplicant(applicant);
                              setShowMypageModal(true);
                            }}
                          >
                            マイページを表示
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showMypageModal && selectedApplicant && (
        <div className="cap-modal-overlay" onClick={() => { setShowMypageModal(false); setSelectedApplicant(null); }}>
          <div className="cap-modal" onClick={e => e.stopPropagation()}>
            <button className="cap-modal-close" onClick={() => { setShowMypageModal(false); setSelectedApplicant(null); }}>&times;</button>
            <Userinfo viewUser={{ id: selectedApplicant.user_id, ...selectedApplicant.profile }} />
          </div>
        </div>
      )}
    </>
  );
};

export default C_Applicant;
