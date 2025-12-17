import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import FaqButton from '../../components/FaqButton/FaqButton';
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu';

import Accordion from '../../components/FaqButton/Accordion';

function Faq() {

  return (
    <>
      <HamburgerMenu />
      <p className="red">よくあるご質問（FAQ）</p>
      <br/>
      {/* <div className="iti">
          <input className="kensaku" type="text" />
          <input className="button" type="button" value="検索" />
      </div> */}
      <Accordion /> {/* 奥田が書いたやつ */}
    </>
  )
}

export default Faq;
