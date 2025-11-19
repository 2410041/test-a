import { useState, useRef, useEffect } from "react";
// useState → 状態変えて保存するやつ
// useRef → 直接DOMにアクセスしたいときに使うやつ
// useEffect → 状態が変わった後に何かしたいときに使うやつ
import "./Accordion.css"; // 奥田が勝手に作ったCSSファイル

const AccordionItem = ({ title, children }) => {
  // ↑ 親コンポーネント(Accordion.jsx)からもらう引数
  // titleはボタンに表示されるテキスト
  // childrenはその下に表示される本文

  const [isOpen, setIsOpen] = useState(false); // 開いてるか閉じてるか
  const contentRef = useRef(null);             // 中身の高さ図るやつ
  const [height, setHeight] = useState("0px"); // 開いた時の高さを管理

  // ぬるっと開かせるための処理
  useEffect(() => {
    // 高さを取得 useRefの中身を見るときは.currentを使うらしい
    const content = contentRef.current;
    if (isOpen) {
      // 中身が全部表示されたときの高さを設定してあげる
      setHeight(`${content.scrollHeight}px`);
    } else {
      setHeight("0px"); 
    }
  }, [isOpen]); // isOpenの状態が変わったときに呼ばれる

  return (
    <div className="accordion-item">
      <div
        className={`accordion-header ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="question">Q</span>
        <div style={{ maxWidth: '900px' }}>{title}</div>
        <span className="triangle">▶</span>
      </div>
      <div
        ref={contentRef}
        className="accordion-content"
        style={{ maxHeight: height }}
        // maxHeightにさっきuseEffectで設定した高さ入れたげる
      >
        <span className="answer">A</span>
        <div className="accordion-inner">{children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;