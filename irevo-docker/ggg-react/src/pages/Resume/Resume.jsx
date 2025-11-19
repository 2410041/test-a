import './resume.css';
import React, { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu';
// import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';


const Resume = () => {
    const captureRef = useRef(null);
    const getWidthRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (getWidthRef.current) {
                const updatedWidth = getWidthRef.current.offsetWidth;
                if (updatedWidth < 1300) {
                    console.log('小さい');
                } else {
                    console.log('いい感じ');
                    if (captureRef.current) {
                        captureRef.current.style.marginLeft = `${(updatedWidth - 1350) / 2}px`;
                    }
                }
            }
        };

        handleResize(); // 初期レンダリング時に実行
        window.addEventListener('resize', handleResize);

        // クリーンアップ関数
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // マウント時とアンマウント時にのみ実行

    const capture = () => {
        if (!captureRef.current) {
            return;
        }

        const element = captureRef.current;
        const pdfWidth = 1350;
        const pdfHeight = 1000;

        html2canvas(element, { width: pdfWidth, height: pdfHeight }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: (pdfWidth > pdfHeight) ? 'landscape' : 'portrait',
                unit: 'px',
                format: [pdfWidth, pdfHeight]
            });
            console.log(pdfWidth);
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('konnichiwa.pdf');
        });
    };

    return (
        <>
        <HamburgerMenu />
            {/* ボタンはReactのイベントハンドラに置き換え */}
            <div className="capture_btn_center">
                <button className="capture_btn" onClick={capture}>
                    画像として保存
                </button>
            </div>
        <div id="getwidht" ref={getWidthRef}>
            <div id="capture" ref={captureRef}>
                <div className="r_photo" />
                <div className="r_title">
                </div>
                <div className="r_day">
                    <p>2025年1月1日現在</p>
                </div>
                {/* 名前・生年月日などの基本情報部分 */}
                <div style={{ verticalAlign: 'middle', position: 'absolute', top: '26mm', left: '10mm', width: '88.5mm', height: '5.2mm', borderWidth: '0.5mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ position: 'absolute', top: '25mm', left: '11mm', width: '88.5mm', height: '5.2mm' }}>
                    <font className="furi">ふりがな</font>
                </div>
                <div style={{ position: 'absolute', top: '25mm', left: '10mm', width: '88.5mm', height: '5.2mm', textAlign: 'center' }}>
                    <font className="furix3">せいふう　たろう</font>
                </div>
                <div style={{ position: 'absolute', top: '26mm', left: '97.7mm', width: '12mm', height: '5.2mm', borderWidth: '0.5mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ position: 'absolute', top: '25mm', left: '98.5mm', width: '12mm', height: '5.2mm' }}>
                    <font className="idx">※男･女</font>
                </div>
                <div style={{ position: 'absolute', top: '25.7mm', left: '100.6mm', width: '12mm', height: '5mm' }}>
                    <font style={{ fontSize: '12pt' }}>○</font>
                </div>
                {/* <div style={{ position: 'absolute', top: '25.7mm', left: '104.6mm', width: '12mm', height: '5mm' }}>
                    <font style={{ fontSize: '12pt' }}>○</font>
                </div> */}
                <div style={{ position: 'absolute', top: '31mm', left: '10mm', width: '99.8mm', height: '16.5mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ position: 'absolute', top: '32mm', left: '11mm', width: '88.5mm', height: '16.5mm' }}>
                    <font className="idx">氏　　名</font>
                </div>
                <div style={{ position: 'absolute', top: '36mm', left: '10mm', width: '88.5mm', height: '16.5mm', textAlign: 'center' }}>
                    <font className="shimei">清風　太郎</font>
                </div>
                <div style={{ position: 'absolute', top: '47mm', left: '10mm', width: '99.8mm', height: '10mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ position: 'absolute', top: '51mm', left: '11mm', width: '100mm', height: '10mm' }}>
                    <font className="idx">生年月日　</font>
                    &nbsp;
                    <font className="idx">平成　</font>
                    <font className="furix">17</font>
                    <font className="idx">　年　　</font>
                    <font className="furix">&nbsp;1</font>
                    <font className="idx">　月　</font>
                    <font className="furix">&nbsp;1</font>
                    <font className="idx">　日生 (満 </font>
                    <font className="furix">20</font>
                    <font className="idx">才)</font>
                </div>
                {/* 住所・電話番号部分 */}
                <div style={{ position: 'absolute', top: '57mm', left: '10mm', width: '100mm', height: '5mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid none none solid' }} />
                <div style={{ position: 'absolute', top: '55.5mm', left: '11mm', width: '100mm', height: '5mm' }}>
                    <font className="furi">ふりがな</font>
                </div>
                <div style={{ position: 'absolute', top: '55.5mm', left: '29mm', width: '100mm', height: '5mm' }}>
                    <font className="furix2">おおさかふおおさかしあべのくまるやまどおり１ちょうめ６−３</font>
                </div>
                <div style={{ position: 'absolute', top: '62mm', left: '10mm', width: '120mm', height: '11.3mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid none solid solid' }} />
                <div style={{ position: 'absolute', top: '60mm', left: '11mm', width: '120mm', height: '11.5mm' }}>
                    <font className="idx">現住所　〒</font>
                    <font className="furix">545-0042</font>
                </div>
                <div style={{ position: 'absolute', top: '67.5mm', left: '12mm', width: '120mm', height: '11.5mm' }}>
                    <font className="adr">大阪府大阪市阿倍野区丸山通１丁目６−３</font>
                </div>
                <div style={{ position: 'absolute', top: '56.9mm', left: '110mm', width: '52.3mm', height: '5mm', borderWidth: '0.5mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid solid none none' }} />
                <div style={{ position: 'absolute', top: '56.9mm', left: '129.7mm', width: '32.5mm', height: '5.2mm', borderWidth: '0.5mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                {/* <div style={{ position: 'absolute', top: '56mm', left: '131mm', width: '32mm', height: '5.5mm' }}>
                    <font className="idx">電話市外(　　　　)</font>
                </div> */}
                {/* <div style={{ position: 'absolute', top: '56mm', left: '142mm', width: '16.5mm', height: '5.55mm', textAlign: 'center' }}>
                    <font className="furix">06</font>
                </div> */}

                <div style={{ position: 'absolute', top: '54.4mm', left: '118.5mm', width: '32mm', height: '5.5mm', textAlign: 'center' }}>
                    <font style={{fontSize: '6pt',fontFamily: 'MS 明朝'}}>携帯電話</font>
                </div>
                <div style={{ position: 'absolute', top: '57.2mm', left: '130mm', width: '32mm', height: '5.5mm', textAlign: 'center' }}>
                    <font style={{fontSize: '7pt',fontFamily: 'MS 明朝'}}>06&nbsp;－&nbsp;2369&nbsp;－&nbsp;2369</font>
                </div>
                <div style={{ position: 'absolute', top: '62.0mm', left: '129.7mm', width: '32.5mm', height: '5.5mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid', textAlign: 'center' }} />
                <div style={{ position: 'absolute', top: '59.4mm', left: '118.5mm', width: '32mm', height: '5.5mm', textAlign: 'center' }}>
                    <font style={{fontSize: '6pt',fontFamily: 'MS 明朝'}}>固定電話</font>
                </div>
                <div style={{ position: 'absolute', top: '62mm', left: '130mm', width: '32mm', height: '5.5mm', textAlign: 'center' }}>
                    <font style={{fontSize: '7pt',fontFamily: 'MS 明朝'}}>06&nbsp;－&nbsp;2369&nbsp;－&nbsp;2369</font>
                </div>
                <div style={{ position: 'absolute', top: '67.3mm', left: '129.7mm', width: '32.5mm', height: '6mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                {/* <div style={{ textAlign: 'center', position: 'absolute', top: '67mm', left: '130mm', width: '32mm', height: '6mm' }}>
                    <font className="idx">(　　　　　　方呼出)</font>
                </div> */}
                <div style={{ position: 'absolute', top: '64.7mm', left: '121.5mm', width: '32mm', height: '5.5mm', textAlign: 'center' }}>
                    <font style={{fontSize: '6pt',fontFamily: 'MS 明朝'}}>メールアドレス</font>
                </div>

                <div style={{ position: 'absolute', top: '68mm', left: '126mm', width: '22mm', height: '5.5mm', textAlign: 'right' }}>
                    <font className="furix_n">i-seifu.jp</font>
                </div>
                <div style={{ position: 'absolute', top: '73.1mm', left: '10mm', width: '152.2mm', height: '5mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.5mm', borderStyle: 'solid solid none solid' }} />
                <div style={{ position: 'absolute', top: '73mm', left: '11mm', width: '152.2mm', height: '5mm' }}>
                    <font className="furi">ふりがな</font>
                </div>
                <div style={{ position: 'absolute', top: '73mm', left: '29mm', width: '152.2mm', height: '5mm' }}>
                    <font className="furix2">おおさかふおおさかしてんのうじくいしがつつじちょう１２−１６</font>
                </div>
                <div style={{ position: 'absolute', top: '78.1mm', left: '10mm', width: '152.2mm', height: '11.5mm', borderWidth: '0.2mm 0.5mm 0.5mm 0.5mm', borderStyle: 'solid', textAlign: 'right' }} />
                <div style={{ position: 'absolute', top: '77mm', left: '10mm', width: '152.2mm', height: '11.5mm', textAlign: 'right' }}>
                    <font className="idx">　　　　　　　　　　(現住所以外の連絡を希望する場合のみ記入)&nbsp;</font>
                </div>
                <div style={{ position: 'absolute', top: '77mm', left: '11mm', width: '152.2mm', height: '11.5mm' }}>
                    <font className="idx">連絡先　〒 </font>
                    <font className="furix">543-0031</font>
                </div>
                <div style={{ verticalAlign: 'middle', textAlign: 'right', position: 'absolute', top: '84.5mm', left: '100mm', width: '60mm', height: '6.5mm', borderWidth: '0.2mm', borderStyle: 'none' }} />
                <div style={{ verticalAlign: 'middle', textAlign: 'right', position: 'absolute', top: '84.5mm', left: '100mm', width: '60mm', height: '6.5mm', borderWidth: '0.2mm', borderStyle: 'none' }}>
                    <font className="furix"> 06-6771-5757</font>
                </div>
                <div style={{ position: 'absolute', top: '84mm', left: '12mm', width: '120mm', height: '11.5mm' }}>
                    <font className="adr">大阪府大阪市天王寺区石ケ辻町１２−１６</font>
                </div>
                {/* 学歴・経歴のテーブル部分 */}
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '92mm', left: '10mm', width: '16.4mm', height: '7.1mm', borderWidth: '0.5mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '94mm', left: '10mm', width: '16.4mm', height: '7.1mm' }}>
                    <font className="idx">年</font>
                </div>
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '92mm', left: '26mm', width: '8.2mm', height: '7.1mm', borderWidth: '0.5mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '94mm', left: '26mm', width: '8.2mm', height: '7.1mm' }}>
                    <font className="idx">月</font>
                </div>
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '92mm', left: '34mm', width: '128.5mm', height: '7.1mm', borderWidth: '0.5mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '94mm', left: '34mm', width: '128mm', height: '7.1mm' }}>
                    <font className="idx">学歴・職歴(各別まとめて書く)</font>
                </div>
                <div style={{ textAlign: 'center', position: 'absolute', top: '99mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '99mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '99mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '108mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '108mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '108mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '117mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '117mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '117mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '126mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '126mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '126mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '135mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '135mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '135mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '144mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '144mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '144mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '153mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '153mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '153mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '162mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '162mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '162mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '171mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '171mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '171mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '180mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '180mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '180mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '189mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '189mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '189mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '198mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '198mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '198mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '207mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '207mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '207mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '216mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '216mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '216mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '225mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '225mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '225mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ position: 'absolute', top: '99.8mm', left: '11mm', width: '20mm', height: '143mm'}}>
                    <font className="textlist">
                        令和3<br />令和6 <br />令和6<br />令和10<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    </font>
                </div>
                <div style={{ textAlign: 'center', position: 'absolute', top: '99.8mm', left: '26.5mm', width: '7.2mm', height: '143mm'}}>
                    <font className="textlist">
                        4<br />3 <br />4<br />3<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    </font>
                </div>
                <div style={{ position: 'absolute', top: '99.8mm', left: '35mm', width: '125.8mm', height: '143mm' }}>
                    <font className="textlist">
                        清風高等学校　　入学<br />清風高等学校　　卒業 <br />清風情報工科学院　　入学<br />清風情報工科学院　　卒業見込み<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    </font>
                </div>

                <div style={{ textAlign: 'center', position: 'absolute', top: '234mm', left: '10mm', width: '16.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.5mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '234mm', left: '26mm', width: '8.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.5mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', verticalAlign: 'middle', position: 'absolute', top: '234mm', left: '34mm', width: '128.5mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.5mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ position: 'absolute', top: '243.1mm', left: '10mm', width: '125mm', height: '8mm' }}>
                    <font className="pic">
                        記入注意　　数字はアラビア数字で、半角２文字または全角１文字で収める
                    </font>
                </div>
                {/* 右側部分 */}
                <div style={{ textAlign: 'center', position: 'absolute', top: '20mm', left: '189mm', width: '16.2mm', height: '7.1mm', borderWidth: '0.5mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '22mm', left: '189mm', width: '16.2mm', height: '7.1mm' }}>
                    <font className="idx">年</font>
                </div>
                <div style={{ textAlign: 'center', position: 'absolute', top: '20mm', left: '205mm', width: '8.4mm', height: '7.1mm', borderWidth: '0.5mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '22mm', left: '205.5mm', width: '8.4mm', height: '7.1mm' }}>
                    <font className="idx">月</font>
                </div>
                <div style={{ textAlign: 'center', position: 'absolute', top: '20mm', left: '213.5mm', width: '128mm', height: '7.1mm', borderWidth: '0.5mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '22mm', left: '214mm', width: '128mm', height: '7.1mm' }}>
                    <font className="idx">免 許・資 格</font>
                </div>
                <div style={{ textAlign: 'center', position: 'absolute', top: '27mm', left: '189mm', width: '16.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '27mm', left: '205mm', width: '8.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '27mm', left: '213.5mm', width: '128mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '36mm', left: '189mm', width: '16.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '36mm', left: '205mm', width: '8.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '36mm', left: '213.5mm', width: '128mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '45mm', left: '189mm', width: '16.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '45mm', left: '205mm', width: '8.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '45mm', left: '213.5mm', width: '128mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '54mm', left: '189mm', width: '16.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '54mm', left: '205mm', width: '8.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '54mm', left: '213.5mm', width: '128mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '63mm', left: '189mm', width: '16.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '63mm', left: '205mm', width: '8.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '63mm', left: '213.5mm', width: '128mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ position: 'absolute', top: '28mm', left: '189mm', width: '20mm', height: '52mm' }}>
                    <font className="textlist">
                        令和7<br /> 令和7<br />令和7<br />令和7<br />令和7<br />令和7<br />
                    </font>
                </div>
                <div style={{ textAlign: 'center', position: 'absolute', top: '28mm', left: '205.5mm', width: '8mm', height: '52mm' }}>
                    <font className="textlist">
                        1<br />1 <br />1<br />1<br />1<br />1<br />
                    </font>
                </div>
                <div style={{ position: 'absolute', top: '28mm', left: '214mm', width: '126mm', height: '52mm' }}>
                    <font className="textlist">
                        第一種普通自動車免許取得<br />ITパスポート試験 合格 <br />基本情報技術者試験 合格<br />AWS Certified Cloud Practitioner<br />AWS Certified Solutions Architect – Associate<br />Oracle Certified Java Programmer, Silver SE 11認定資格
                    </font>
                </div>
                <div style={{ textAlign: 'center', position: 'absolute', top: '72mm', left: '189mm', width: '16.2mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.5mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '72mm', left: '205mm', width: '8.4mm', height: '9.2mm', borderWidth: '0.2mm 0.2mm 0.5mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ textAlign: 'center', position: 'absolute', top: '72mm', left: '213.5mm', width: '128mm', height: '9.2mm', borderWidth: '0.2mm 0.5mm 0.5mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ position: 'absolute', top: '82mm', left: '189mm', width: '76.1mm', height: '36.6mm', borderWidth: '0.5mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid' }} />
                <div style={{ position: 'absolute', top: '83mm', left: '190mm', width: '76.1mm', height: '37.2mm' }}>
                    <font className="idx">得意な科目・分野</font>
                </div>
                <div style={{ position: 'absolute', top: '78mm', left: '190mm', width: '76mm', height: '36mm' }}>
                    <table style={{ border: '0', width: '100%', height: '100%' }}>
                        <tbody>
                            <tr>
                                <td align="center">
                                    <table width="80%">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <font className="textlist">
                                                        国語<br />数学<br />英語<br />
                                                    </font>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ position: 'absolute', top: '82mm', left: '265mm', width: '76.1mm', height: '36.6mm', borderWidth: '0.5mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid' }} />
                <div style={{ position: 'absolute', top: '83mm', left: '266mm', width: '76.1mm', height: '37.2mm' }}>
                    <font className="idx">健康状態</font>
                </div>
                <div style={{ position: 'absolute', top: '78mm', left: '266mm', width: '76mm', height: '36mm' }}>
                    <table width="100%" height="100%">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <table width="80%">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <font className="textlist">
                                                        良好<br /><br /><br />
                                                    </font>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ position: 'absolute', top: '118mm', left: '189mm', width: '76.1mm', height: '36.2mm', borderWidth: '0.2mm 0.2mm 0.2mm 0.5mm', borderStyle: 'solid solid solid solid' }} />
                <div style={{ position: 'absolute', top: '119mm', left: '190mm', width: '76.1mm', height: '36.2mm' }}>
                    <font className="idx">スポーツ・クラブ活動・文化活動など</font>
                </div>
                <div style={{ position: 'absolute', top: '113mm', left: '190mm', width: '76.1mm', height: '36.2mm' }}>
                    <table border="0" width="100%" height="100%">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <table width="80%">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <font className="textlist">
                                                        サッカー<br />バドミントン<br />空手<br />
                                                    </font>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ position: 'absolute', top: '118mm', left: '265mm', width: '76.1mm', height: '36.2mm', borderWidth: '0.2mm 0.5mm 0.2mm 0.2mm', borderStyle: 'solid solid solid solid' }} />
                <div style={{ position: 'absolute', top: '119mm', left: '266mm', width: '76.1mm', height: '36.2mm' }}>
                    <font className="idx">趣味・特技</font>
                </div>
                <div style={{ position: 'absolute', top: '113mm', left: '266mm', width: '76.1mm', height: '36.2mm' }}>
                    <table border="0" width="100%" height="100%">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <table width="80%">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <font className="textlist">
                                                        A<br />B<br />C<br />
                                                    </font>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ position: 'absolute', top: '154mm', left: '189mm', width: '152.3mm', height: '35.3mm', borderWidth: '0.2mm 0.5mm 0.5mm 0.5mm', borderStyle: 'solid solid solid solid' }} />
                <div style={{ position: 'absolute', top: '153mm', left: '190mm', width: '152.1mm', height: '35.3mm' }}>
                    <font className="idx">志望の動機</font>
                </div>
                <div style={{ position: 'absolute', top: '154mm', left: '190mm', width: '152.1mm', height: '35.3mm' }}>
                    <table border="0" width="100%" height="100%" cellPadding="16">
                        <tbody>
                            <tr>
                                <td valign="top">
                                    <font className="textlist3">
                                        {/* 264文字がマックス */}
                                        貴社が掲げる「顧客に寄り添う」という経営理念に強く共感し、システムエンジニアとして貢献したいと思い志望いたしました。
                                        入社後は、これまでの営業経験で培った課題発見能力とコミュニケーション能力を活かし、お客様の潜在的なニーズを汲み取り、より良いシステムを提案することで貴社に貢献したいと考えております。
                                        将来的には、プロジェクトマネージャーとして、チームを牽引し、より大きなプロジェクトを成功に導きたいです。
                                    </font>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ position: 'absolute', top: '189mm', left: '189mm', width: '152.1mm', height: '56mm', borderWidth: '0.2mm 0.5mm 0.5mm 0.5mm', borderStyle: 'solid solid solid solid' }} />
                <div style={{ position: 'absolute', top: '190mm', left: '190mm', width: '152.1mm', height: '56mm' }}>
                    <font className="idx">
                        本人希望記入欄（特に給料・職種・勤務時間・勤務地・その他について希望があれば記入）
                    </font>
                </div>
                <div style={{position: 'absolute', top: '191mm', left: '191mm', width: '152.1mm', height: '56mm' }}>
                    <table border="0" width="100%" height="100%" cellPadding="16">
                        <tbody>
                            <tr>
                                <td valign="top">
                                    <font className="textlist3">
                                        特にありません<br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                                    </font>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </>
    );
};

export default Resume;