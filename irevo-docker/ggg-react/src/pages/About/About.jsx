import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>運営会社について</h1>
        <p>IT業界で活躍したい学生のための就職支援を行っています。</p>
      </section>

      <section className="about-section">
        <h3>私たちのミッション</h3>
        <p>
          株式会社就職ナビは、IT業界に特化した求人情報とサポートを通じて、
          学生一人ひとりのキャリア選択を全力で応援しています。
        </p>
      </section>

      <section className="about-section">
        <h3>主な事業内容</h3>
        <ul>
          <li>IT業界向け求人情報の提供</li>
          <li>学生向け履歴書・志望動機作成支援（AI活用）</li>
          <li>IT企業とのマッチングイベントの開催</li>
          <li>オンライン面接練習ツールの運営</li>
        </ul>
      </section>

      <section className="about-section">
        <h3>会社概要</h3>
        <table>
          <tbody>
            <tr>
              <th>会社名</th>
              <td>株式会社iRevo</td>
            </tr>
            <tr>
              <th>所在地</th>
              <td>大阪府大阪市阿倍野区丸山通１丁目６−３</td>
            </tr>
            <tr>
              <th>設立</th>
              <td>2025年5月</td>
            </tr>
            <tr>
              <th>代表者</th>
              <td>代表取締役　小野 紘輝</td>
            </tr>
            <tr>
              <th>メール</th>
              <td>contact@irevo-careers.co.jp</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default About;
