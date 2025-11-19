import { useEffect } from 'react';
import './FaqButton.css'; // CSSファイルをインポート
import useFaq from './useFaq'; // カスタムフックをインポート

function FaqButton() {

    useFaq(); // FAQのカスタムフックを実行

    return (
        <>
            <details className="details js-details">
                <summary className="details-summary js-details-summary">
                    <span className="btn"></span>1つ目のアコーディオンのタイトル
                </summary>
                <div className="details-content js-details-content">
                    <p>ここは、1つ目のアコーディオンの中身です。</p>
                    <p>ここは、1つ目のアコーディオンの中身です。</p>
                    <p>ここは、1つ目のアコーディオンの中身です。</p>
                    <p>ここは、1つ目のアコーディオンの中身です。</p>
                </div>
            </details>
            <details className="details js-details">
                <summary className="details-summary js-details-summary">
                    <span className="btn"></span>2つ目のアコーディオンのタイトル
                </summary>
                <div className="details-content js-details-content">
                    <p>ここは、2つ目のアコーディオンの中身です。</p>
                </div>
            </details>
        </>

    );
}

export default FaqButton;