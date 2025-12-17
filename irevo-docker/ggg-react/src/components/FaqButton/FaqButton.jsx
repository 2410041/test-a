import { useEffect } from 'react';
import './FaqButton.css'; // CSSファイルをインポート
import useFaq from './useFaq'; // カスタムフックをインポート

function FaqButton() {

    useFaq(); // FAQのカスタムフックを実行

    return (
        <>
            <div className="faq-accordion">
                <details className="details js-details">
                    <summary className="details-summary js-details-summary" role="button" aria-expanded="false">
                        <span className="summary-title">1つ目のアコーディオンのタイトル</span>
                        <span className="btn" aria-hidden="true"></span>
                    </summary>
                    <div className="details-content js-details-content" aria-hidden="true">
                        <p>ここは、1つ目のアコーディオンの中身です。</p>
                        <p>ここは、1つ目のアコーディオンの中身です。</p>
                        <p>ここは、1つ目のアコーディオンの中身です。</p>
                        <p>ここは、1つ目のアコーディオンの中身です。</p>
                    </div>
                </details>

                <details className="details js-details">
                    <summary className="details-summary js-details-summary" role="button" aria-expanded="false">
                        <span className="summary-title">2つ目のアコーディオンのタイトル</span>
                        <span className="btn" aria-hidden="true"></span>
                    </summary>
                    <div className="details-content js-details-content" aria-hidden="true">
                        <p>ここは、2つ目のアコーディオンの中身です。</p>
                    </div>
                </details>
            </div>
        </>

    );
}

export default FaqButton;