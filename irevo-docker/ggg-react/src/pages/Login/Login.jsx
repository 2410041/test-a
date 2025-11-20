// ログイン画面用スタイル
import "./Login.css";
// ハンバーガーメニューコンポーネント
import HamburgerMenu from "../../components/HamburgerMenu/HamburgerMenu";
// Reactの状態管理フック
import { useState } from "react";
// API通信用
import axios from "axios";
// 画面遷移用フック
import { useNavigate } from "react-router-dom";


// ログイン画面コンポーネント
export default function Login() {
  // メールアドレス入力値
  const [email, setEmail] = useState("hanako@example.com");
  // パスワード入力値
  const [password, setPassword] = useState("password456");
  // エラーメッセージ
  const [error, setError] = useState("");
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

    try {
      const res = await axios.post(
        "http://15.152.5.110:3030/log/login",
        { email, password },
        { withCredentials: true } // セッションCookie対応
      );

      if (res.data.success) {
        console.log("ログイン成功:", res.data.user);
        navigate("/Mypage");
      } else {
        setError(res.data.message || "ログインに失敗しました");
      }
    } catch (err) {
      console.error("ログインエラー:", err);
      setError("サーバーエラーが発生しました");
    }
  };

  // デバッグ用ログは削除するか、開発環境のみに制限
  // console.log("2410041@i-seifu.jp");
  // console.log("2024Gakusei$");

  // 画面描画部分
  return (
    <>
      {/* ハンバーガーメニュー */}
      <HamburgerMenu />
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
            <button type="submit" className="submit_button">
              ログイン
            </button>
            {/* エラーメッセージ表示 */}
            {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
            <p>
              {/* 新規登録ページへのリンク */}
              <a href="NewReg" className="new">
                新規登録
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}