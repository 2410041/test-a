import React from 'react';
import './Privacy.css';

const TermsAndPrivacy = () => {
    return (<div className="terms-container2">
        <section>
            <h1>プライバシーポリシー</h1>
            <p>株式会社iRevo（以下、「当社」といいます。）は、当社が提供する「iRevo」（以下、「本サービス」といいます。）において、ユーザーの個人情報を適切に取り扱うため、以下のとおりプライバシーポリシーを定めます。</p>

            <h3 className='dai3'>1. 取得する情報</h3>
            <ul>
                <li>氏名、メールアドレス、電話番号、住所等</li>
                <li>学歴・職歴、資格情報、希望職種等</li>
            </ul>

            <h3 className='dai3'>2. 利用目的</h3>
            <ul>
                <li>求人情報の提供およびマッチングのため</li>
                <li>応募・面談などの連絡のため</li>
                <li>サービス改善や新機能の開発のため</li>
            </ul>

            <h3 className='dai3'>3. 第三者提供</h3>
            <p>当社は、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。</p>

            <h3 className='dai3'>4. 安全管理</h3>
            <p>当社は、個人情報の漏洩、滅失、毀損を防ぐため、適切な安全管理措置を講じます。</p>

            <h3 className='dai3'>5. 開示・訂正・削除等</h3>
            <p>ユーザーは、自己の個人情報について開示、訂正、削除等を求めることができます。</p>

            <h3 className='dai3'>6. お問い合わせ窓口</h3>
            <p>個人情報の取り扱いに関するお問い合わせは、以下の窓口までご連絡ください：</p>
            <p>
                株式会社iRevo プライバシー窓口<br />
                Email: privacy@irevo-careers.co.jp
            </p>

            <h3 className='dai3'>7. プライバシーポリシーの変更</h3>
            <p>当社は、必要に応じて本プライバシーポリシーを変更することがあります。変更後の内容は本サイトに掲載します。</p>
        </section>
    </div>

    );
};

export default TermsAndPrivacy;


