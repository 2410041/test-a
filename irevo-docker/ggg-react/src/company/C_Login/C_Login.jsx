// ログイン画面用スタイル
import "./C_Login.css";
// ハンバーガーメニューコンポーネント
import Header from '../../components/C_Header/C_Header';
// Reactの状態管理フック
import { useState } from "react";
// API通信用
import axios from "axios";
// 画面遷移用フック
import { useNavigate } from "react-router-dom";


// ログイン画面コンポーネント
export default function Login() {
  // メールアドレス入力値
  const [email, setEmail] = useState("");
  // パスワード入力値
  const [password, setPassword] = useState("");
  // エラーメッセージ
  const [error, setError] = useState("");
  // ローディング状態
  const [loading, setLoading] = useState(false);
  // 画面遷移用
  const navigate = useNavigate();

  // パスワード表示/非表示切替処理
  const handleToggleClick = (e) => {
    const input = e.target.previousElementSibling;
    const type = input.getAttribute('type');
    input.setAttribute('type', type === 'password' ? 'text' : 'password');
    e.target.classList.toggle('is-visible');
  };

  // ログインフォーム送信時の処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // APIへログインリクエスト
      // 企業向けログインは /company/login を使う
      const res = await axios.post(
        "http://15.152.5.110:3030/company/login",
        { email, password },
        { withCredentials: true }
      );

      // ログイン成功時は企業ダッシュボードへ遷移
      if (res.data && res.data.success) {
        navigate("/C_Dashboard");
      } else {
        setError(res.data?.message || "ログインに失敗しました");
      }
    } catch (err) {
      console.error('C_Login error:', err);
      // サーバーエラー時
      setError("サーバーエラーが発生しました");
    }
    setLoading(false);
  };

  // デバッグ用ログ（本番では削除）
  // デバッグログは不要

  // 画面描画部分
  return (
    <>
      {/* ハンバーガーメニュー */}
      <Header />
      <div className="main" id="myMain">
        <div style={{ textAlign: "center" }}>
          <p className="title">ログイン</p>
        </div>
        {/* ログインフォーム */}
        <form onSubmit={handleSubmit}>
          <div style={{ paddingTop: 30 }}>
            <div style={{ textAlign: "center", marginTop: 30 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: 650,
                  margin: "auto"
                }}
              >
                {/* メールアドレス入力欄 */}
                <label style={{ marginRight: 40, width: 200 }}>
                  メールアドレス
                </label>
                <div className="name-wrapper">
                  <input
                    type="text"
                    className="password__input"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 30 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "fit-content",
                  margin: "auto",
                  minWidth: 650,
                  maxWidth: 650
                }}
              >
                {/* パスワード入力欄 */}
                <label style={{ marginRight: 40, width: 200, textAlign: "center" }}>
                  パスワード
                </label>
                <div className="password-wrapper">
                  <input
                    type="password"
                    className="password__input"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  {/* パスワード表示切替ボタン */}
                  <button
                    type="button"
                    className="password__toggle2"
                    onClick={handleToggleClick}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            {/* ログインボタン */}
            <button type="submit" className="submit_button" disabled={loading}>
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
            {/* エラーメッセージ表示 */}
            {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
            <p>
              {/* 新規登録ページへのリンク */}
              <a href="C_NewReg" className="new">
                新規登録
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}