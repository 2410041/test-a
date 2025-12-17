import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './C_Userlist.css';
import HamburgerMenu from '../../components/C_Header/C_Header';

export default function C_Userlist() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3030/user/', { withCredentials: true });
        if (!mounted) return;
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('ユーザー一覧取得失敗', err);
        if (!mounted) return;
        setError('ユーザー一覧の取得に失敗しました');
        setUsers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => { mounted = false; };
  }, []);

  // 企業側から特定ユーザーへチャットを作成する（/user/user_chat/start を呼ぶ）
  const handleStartChat = async (userId) => {
    try {
      // 企業セッションを取得
      const who = await axios.get('http://localhost:3030/company/whoami', { withCredentials: true });
      if (!who.data?.loggedIn) {
        alert('企業としてログインしてください');
        return;
      }
      const company = who.data.company;
      if (!company || !company.id) {
        alert('企業情報が見つかりません');
        return;
      }

      // チャット開始 API を呼ぶ
      await axios.post('http://localhost:3030/user/user_chat/start', {
        user_id: userId,
        Companies_id: company.id
      }, { withCredentials: true });

      // 成功したらチャット画面へ遷移。state で targetUserId を渡す（必要に応じて C_Chat を修正）
      navigate('/C_Chat', { state: { targetUserId: userId, Companies_id: company.id } });
    } catch (err) {
      console.error('チャット開始に失敗しました', err);
      alert('チャットの開始に失敗しました');
    }
  };

  return (
    <>
      <HamburgerMenu />
      <div className="cul-container">
        <h2 className="cul-title">就活者一覧</h2>
        {loading ? (
          <div>読み込み中...</div>
        ) : (
          <>
            {error && <div className="cul-error">{error}</div>}
            <div className="cul-table_wrap">
              <table className="cul-table">
                <thead>
                  <tr>
                    <th>名前</th>
                    <th>ニックネーム</th>
                    <th>メール</th>
                    <th>電話</th>
                    <th>就業状態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center' }}>ユーザーが見つかりません</td></tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id}>
                        <td>{(u.u_Fname || '') + ' ' + (u.u_Lname || '')}</td>
                        <td>{u.u_nick || '-'}</td>
                        <td>{u.u_Email || '-'}</td>
                        <td>{u.u_Contact || '-'}</td>
                        <td>{u.Employment || '-'}</td>
                        <td>
                          <button className="cul-button" onClick={() => handleStartChat(u.id)}>チャット送信</button>
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
    </>
  );
}
