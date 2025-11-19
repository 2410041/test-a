import AccordionItem from "./AccordionItem";

const Accordion = () => {
  return (
    // わざわざcomponentフォルダにこれ置かずに直接Faq.jsxに書いてもいいかもね
    <div className="accordion">
      <AccordionItem title="1つ目のアコーディオンのタイトル">
        {/* ↓コンポーネントタグに挟まれてる中身がchildrenになる */}
        <p>ここは、1つ目のアコーディオンの中身です。</p>
        <p>ここは、1つ目のアコーディオンの中身です。</p>
        <p>ここは、1つ目のアコーディオンの中身です。</p>
        <p>ここは、1つ目のアコーディオンの中身です。</p>
      </AccordionItem>
      <AccordionItem title="2つ目のアコーディオンのタイトル">
        <p>ここは、2つ目のアコーディオンの中身です。</p>
      </AccordionItem>
    </div>
  );
};

export default Accordion;