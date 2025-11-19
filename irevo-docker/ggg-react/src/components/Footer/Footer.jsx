import React from 'react';
import './Footer.css';
import Image from './iRevo-logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* ナビゲーション */}
        <div className="footer-section">
          <h3>メニュー</h3>
          <ul>
            <li><a href="/">トップページ</a></li>
            <li><a href="/Company">求人ページ</a></li>
            <li><a href="/chat-api">面接練習</a></li>
            <li><a href="/Login">ログイン</a></li>
          </ul>
        </div>

        {/* サポート */}
        <div className="footer-section">
          <h3>サポート</h3>
          <ul>
            <li><a href="/Resumeform">履歴書作成</a></li>
            <li><a href="/Mypage">資格ガイド</a></li>
            <li><a href="/Faq">FAQ</a></li>
            <li><a href="/Contact">お問い合わせ</a></li>
          </ul>
        </div>

        {/* 運営情報 */}
        <div className="footer-section">
          <h3>運営</h3>
          <ul>
            <li><a href="/About">運営会社について</a></li>
            <li><a href="/Terms">利用規約</a></li>
            <li><a href="/privacy">プライバシーポリシー</a></li>
          </ul>
        </div>
      </div>
      <div className='img-around'>
        <img src={Image} className='img' />
      </div>
      <div className="footer-bottom">
        © 2025 iRvo Inc. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
