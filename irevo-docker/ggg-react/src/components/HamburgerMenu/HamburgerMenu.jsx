import './HamburgerMenu.css';
import { Link } from 'react-router-dom';
import useHeaderMenu from './useHeaderMenu';
import '../Header/Header.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HamburgerMenu() {

  useHeaderMenu(); // ハンバーガー制御のカスタムフックを実行

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const checkLogin = async () => {
      try {
        const response = await axios.get('http://15.152.5.110:3030/log/whoami', {
          withCredentials: true  // この設定が重要
        });
        if (!mounted) return;
        if (response.data.loggedIn) {
          setLoggedIn(true);
          setUser(response.data.user);
        } else {
          setLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('whoami error:', error);
        // 401エラーは正常な動作なので、ログインしていない状態として処理
        setLoggedIn(false);
        setUser(null);
      }
    };
    checkLogin();
    return () => { mounted = false; };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://15.152.5.110:3030/log/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('logout error:', err);
      // 失敗してもクライアント側はログアウト扱いにする
    } finally {
      setLoggedIn(false);
      setUser(null);
      console.log(user);
      navigate('/login'); // ログアウト後にログインページへ
    }
  };

  return (
    <>
      <header className="header" id="myHeader">
        <button
          className="hamburger"
          aria-label="メニュー"
          aria-controls="nav-menu"
          aria-expanded="false"
        >
          <span className="hamburger__line"></span>
          <span className="hamburger__line"></span>
          <span className="hamburger__line"></span>
        </button>
        <nav id="nav-menu" className="h_nav" aria-hidden="true">
          <ul className="nav__list">
            <li className="nav__item"><a href="Mypage" className="nav__link">マイページ</a></li>
            <li className="nav__item"><a href="Company" className="nav__link">求人ページ</a></li>
            <li className="nav__item"><a href="Jobmap" className="nav__link">マップ求人</a></li>
            <li className="nav__item"><a href="Resumeform" className="nav__link">履歴書作成</a></li>
            <li className="nav__item"><a href="chat-api" className="nav__link">面接練習</a></li>
            <li className="nav__item"><a href="Mytype" className="nav__link">自己診断</a></li>
            <li className="nav__item"><a href="./Testchat" className="nav__link">チャット</a></li>
            <li className="nav__item"><a href="faq" className="nav__link">FAQ</a></li>
            <li className="nav__item"><a href="Contact" className="nav__link">お問い合わせ</a></li>
            {loggedIn ? (
              // ログイン中 → ログアウトリンクを表示
              <li className="nav__item">
                <a href="#" className="nav__link" onClick={handleLogout}>
                  ログアウト
                </a>
              </li>
            ) : (
              // 未ログイン → ログインリンクを表示（既存と同じ）
              <li className="nav__item"><a href="login" className="nav__link">ログイン</a></li>
            )}

            <li className="nav__item"><a href="./Admin" className="nav__link">管理者ページ</a></li>
          </ul>
        </nav>
        <img src="./images/iRevo-icon.png" className="icon"></img>
      </header>
    </>
  )
};
