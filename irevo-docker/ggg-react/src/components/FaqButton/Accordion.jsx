import { useState, useRef, useEffect } from "react";
import './Accordion.css';

const Accordion = () => {
  const items = [
    {
      title: "サイトの利用は無料ですか？",
      children: (
        <p>はい、当サイトのサービスはすべて無料でご利用いただけます。会員登録や求人の閲覧、応募も追加料金は発生しません。</p>
      )
    },
    {
      title: "会員登録には何が必要ですか？",
      children: (
        <p>メールアドレスと基本情報（氏名、生年月日、学校名など）が必要です。登録後、プロフィールを充実させるとスカウト受信率が上がります。</p>
      )
    },
    {
      title: "複数の企業に同時に応募しても大丈夫ですか？",
      children: (
        <p>はい、問題ありません。複数応募して、あなたに合った企業との出会いを広げてください。</p>
      )
    },
    {
      title: "応募書類（履歴書やES）はサイト上で作成できますか？",
      children: (
        <p>はい、サイト上で履歴書やエントリーシート（ES）を作成・保存できます。テンプレートも用意しているので、簡単に作成可能です。</p>
      )
    },
    {
      title: "掲載されている企業は信頼できますか？",
      children: (
        <p>はい、掲載されている企業は厳しい審査を通過した信頼できる企業です。安心してご利用ください。</p>
      )
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  useEffect(() => {
    // contentRefs の長さを items に合わせる
    contentRefs.current = contentRefs.current.slice(0, items.length);
  }, [items.length]);

  const toggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="accordion" role="region" aria-label="よくある質問">
      {items.map((it, i) => (
        <article className="accordion-item" key={i}>
          <header className={`accordion-header ${openIndex === i ? 'open' : ''}`}>
            <button
              className="accordion-btn"
              aria-expanded={openIndex === i}
              aria-controls={`acc-panel-${i}`}
              id={`acc-btn-${i}`}
              onClick={() => toggle(i)}
            >
              <span className="question" aria-hidden="true">Q</span>
              <span className="accordion-title">{it.title}</span>
              <span className="triangle" aria-hidden="true">{/* triangle via CSS */}▸</span>
            </button>
          </header>

          <div
            id={`acc-panel-${i}`}
            role="region"
            aria-labelledby={`acc-btn-${i}`}
            className="accordion-content"
            ref={el => (contentRefs.current[i] = el)}
            style={{
              maxHeight: openIndex === i && contentRefs.current[i] ? `${contentRefs.current[i].scrollHeight}px` : '0px'
            }}
          >
            <div className="accordion-inner">
              <span className="answer" aria-hidden="true">A</span>
              <div className="accordion-body">{it.children}</div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Accordion;