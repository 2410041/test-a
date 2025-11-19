import { useEffect } from 'react';
import './FaqButton.css'; // CSSファイルをインポート

function useFaq() {
    useEffect(() => {
        const accordionDetails = '.js-details';
        const accordionSummary = '.js-details-summary';
        const accordionContent = '.js-details-content';
        const speed = 500;

        console.log("test");

        // ヘルパー関数：スライドアップ（非表示にする）
        function animateSlideUp(element, duration, callback) {
            console.log(animateSlideUp);
            console.log(element);
            
            
            // 正確な高さを取得（slideDownと同じ方法で）
            const height = element.scrollHeight-40;
            element.style.overflow = 'hidden'; // 要素がはみ出したら消える
            element.style.height = height + 'px'; // 閉じるときのスタート位置
            
            // 強制的に再描画
            element.offsetHeight; 
            
            // トランジションを設定してから0にする
            element.style.transition = `height ${duration}ms ease`;
            element.style.height = '0';
            
            setTimeout(() => {
                console.log("setTimeout" + setTimeout);
                console.log("閉まる第二処理");                
                
                
                element.style.display = 'none';
                element.style.height = '';
                element.style.transition = '';
                element.style.overflow = '';
                if (callback) callback();
            }, duration);
        }

        // ヘルパー関数：スライドダウン（表示する）
        function animateSlideDown(element, duration) {
            element.style.removeProperty('display');
            let display = window.getComputedStyle(element).display;
            if (display === 'none') display = 'block';
            element.style.display = display;

            // 一時的にheightを自動にして正確な高さを取得
            element.style.height = 'auto';
            const height = element.scrollHeight;
            console.log("height" + height);
            
            // アニメーション用の初期設定
            element.style.height = '0';
            element.style.overflow = 'hidden';
            element.style.transition = `height ${duration}ms ease`;
            

            requestAnimationFrame(() => {
                element.style.height = (height - 40) + 'px';
            });

            setTimeout(() => {
                console.log("openの第二処理");
                
                element.style.height = 'auto';
                element.style.transition = '';
                element.style.overflow = '';
            }, duration);
        }

        // クリックハンドラー関数を定義
        function handleSummaryClick(event) {
            event.preventDefault();
            this.classList.toggle('is-active');
            
            // btnクラスの要素も回転させる
            const btnElement = this.querySelector('.btn');
            if (btnElement) {
                btnElement.classList.toggle('is-active');
            }
            
            console.log("is-active");

            const parent = this.closest(accordionDetails);
            
            const content = parent.querySelector(accordionContent);
            const isOpen = parent.hasAttribute('open');

            // 他を閉じる
            document.querySelectorAll(accordionSummary).forEach(s => {
                if (s !== this) {
                    s.classList.remove('is-active');
                    // 他のbtn要素のis-activeクラスも削除
                    const otherBtn = s.querySelector('.btn');
                    if (otherBtn) {
                        otherBtn.classList.remove('is-active');
                    }
                }
            });
            document.querySelectorAll(accordionDetails).forEach(d => {
                if (d !== parent && d.hasAttribute('open')) {
                    d.removeAttribute('open');
                    const otherContent = d.querySelector(accordionContent);
                    if (otherContent) {
                        animateSlideUp(otherContent, speed);
                    }
                }
            });

            if (isOpen) {
                console.log("isOpen" + isOpen);
                
                animateSlideUp(content, speed, () => {
                    parent.removeAttribute('open');
                    content.style.display = '';
                });
            } else {
                console.log("isOpen" + isOpen);

                parent.setAttribute('open', 'true');                
                content.style.display = 'none';
                animateSlideDown(content, speed);
            }
        }

        // アコーディオン初期化
        console.log(document.querySelectorAll(accordionSummary));
        const summaryElements = document.querySelectorAll(accordionSummary);
        
        summaryElements.forEach(summary => {
            // 既存のイベントリスナーを削除してから追加
            summary.removeEventListener('click', handleSummaryClick);
            summary.addEventListener('click', handleSummaryClick);
        });

        // クリーンアップ関数でイベントリスナーを削除
        return () => {
            summaryElements.forEach(summary => {
                summary.removeEventListener('click', handleSummaryClick);
            });
        };
    }, []); // 依存配列を空にして、マウント時のみ実行
    }
export default useFaq;


