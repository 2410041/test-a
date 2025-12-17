import React, { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './school/sheet.css'; 

const RESUME_WRAPPER_CLASS = 'resume-print-wrapper';

const ResumeA3 = () => {

    // ... (A3_WIDTH_MMとA3_HEIGHT_MMはそのまま使用)
    const A3_WIDTH_MM = 297;
    const A3_HEIGHT_MM = 420;

    // 修正1: targetElementをラッパー要素に変更
    const generatePdf = async () => {
        // キャプチャ対象を、余白を設定したラッパー要素に変更します
        const targetElement = document.querySelector(`.${RESUME_WRAPPER_CLASS}`);

        if (!targetElement) {
            alert('PDFにしたい要素が見つかりませんでした。');
            return;
        }

        try {
            const canvas = await html2canvas(targetElement, {
                scale: 2,
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                // 横長の履歴書に合わせるため 'l' (Landscape) を維持
                orientation: 'l', 
                unit: 'mm',
                format: 'a3'
            });

            // 横長A3のサイズ (420mm x 297mm) に固定
            let imgWidth = A3_HEIGHT_MM;   
            let imgHeight = A3_WIDTH_MM;  
            
            const x = 0; 
            const y = 0; 

            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            pdf.save('履歴書_ResumeA3.pdf');

        } catch (error) {
            console.error('PDF生成中にエラーが発生しました:', error);
            alert('PDFの保存に失敗しました。');
        }
    };

    // PNGとして保存（こちらもキャプチャ対象をラッパー要素に変更）
    const saveAsPng = async () => {
        // キャプチャ対象を、余白を設定したラッパー要素に変更します
        const targetElement = document.querySelector(`.${RESUME_WRAPPER_CLASS}`);

        if (!targetElement) {
            alert('PNGにしたい要素が見つかりませんでした。');
            return;
        }

        try {
            const canvas = await html2canvas(targetElement, {
                scale: 3,
                useCORS: true,
                logging: false
            });

            canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '履歴書_ResumeA3.png';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            }, 'image/png');
        } catch (error) {
            console.error('PNG生成中にエラーが発生しました:', error);
            alert('PNGの保存に失敗しました。');
        }
    };
    
    // ... (handlePdfClick と handlePngClick は変更なし)

    const handlePdfClick = useCallback(() => {
        generatePdf();
    }, []);

    const handlePngClick = useCallback(() => {
        saveAsPng();
    }, []);    // JSXコンポーネントの返り値
    return (
        <>
            {/* HTMLの<head>内の要素は、すべてルートのindex.htmlに移動するか、
                CSS Importに置き換えることが推奨されます。
                ここではすべてimportに置き換えられたと仮定し、要素を削除しています。
            */}

            <div className={RESUME_WRAPPER_CLASS}>
            {/* A3.html の <body> タグ内のコンテンツ */}
            <div className="ritz grid-container" dir="ltr">
                <table className="waffle no-grid" cellSpacing="0" cellPadding="0">
                    <thead>
                        <tr>
                            <th className="row-header freezebar-origin-ltr" style={{ width: '0px' }}></th>
                            <th id="147173032C0" style={{ width: '66px' }} className="column-headers-background"></th>
                            <th id="147173032C1" style={{ width: '46px' }} className="column-headers-background"></th>
                            <th id="147173032C2" style={{ width: '423px' }} className="column-headers-background"></th>
                            <th id="147173032C3" style={{ width: '73px' }} className="column-headers-background"></th>
                            <th id="147173032C4" style={{ width: '56px' }} className="column-headers-background"></th>
                            <th id="147173032C5" style={{ width: '40px' }} className="column-headers-background"></th>
                            <th id="147173032C6" style={{ width: '17px' }} className="column-headers-background"></th>
                            <th id="147173032C7" style={{ width: '15px' }} className="column-headers-background"></th>
                            <th id="147173032C8" style={{ width: '57px' }} className="column-headers-background"></th>
                            <th id="147173032C9" style={{ width: '101px' }} className="column-headers-background"></th>
                            <th id="147173032C10" style={{ width: '45px' }} className="column-headers-background"></th>
                            <th id="147173032C11" style={{ width: '52px' }} className="column-headers-background"></th>
                            <th id="147173032C12" style={{ width: '219px' }} className="column-headers-background"></th>
                            <th id="147173032C13" style={{ width: '213px' }} className="column-headers-background"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ height: '34px' }}>
                            <th id="147173032R0" style={{ height: '34px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '34px' }}></div>
                            </th>
                            <td className="s0" colSpan="3">履　歴　書</td>
                            <td className="s1" colSpan="3">年月日　現在</td>
                            <td className="s2"></td>
                            <td className="s3"></td>
                            <td className="s4"></td>
                            <td className="s4"></td>
                            <td className="s5"></td>
                            <td className="s5"></td>
                            <td className="s5"></td>
                            <td className="s6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R1" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s7">フリガナ</td>
                            <td className="s8" dir="ltr" colSpan="2"></td>
                            <td className="s9"></td>
                            <td className="s9"></td>
                            <td className="s10"></td>
                            <td className="s11"></td>
                            <td className="s12" dir="ltr" colSpan="7"> 【志望動機】</td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R2" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s13" rowSpan="2">氏 名</td>
                            <td className="s14" dir="ltr" colSpan="2" rowSpan="2"></td>
                            <td className="s15" colSpan="3">写真を貼る位置</td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" dir="ltr" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R3" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s18" colSpan="3">縦40～45mm</td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" dir="ltr" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R4" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s19">生年月日</td>
                            <td className="s17" dir="ltr" colSpan="2"></td>
                            <td className="s18" colSpan="3">横30～35mm</td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" dir="ltr" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R5" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s19">携帯番号</td>
                            <td className="s17" dir="ltr" colSpan="2"></td>
                            <td className="s18" colSpan="3">本人単身胸から上</td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" dir="ltr" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R6" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s19">E-mail</td>
                            <td className="s17" dir="ltr" colSpan="2"></td>
                            <td className="s1" colSpan="3">写真裏に氏名記入</td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" dir="ltr" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R7" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s13">Portfolio</td>
                            <td className="s20" colSpan="2"></td>
                            <td className="s21"></td>
                            <td className="s21"></td>
                            <td className="s22"></td>
                            <td className="s23"></td>
                            <td className="s16"></td>
                            <td className="s17" dir="ltr" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R8" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s7">フリガナ</td>
                            <td className="s8" dir="ltr" colSpan="5"></td>
                            <td className="s23"></td>
                            <td className="s24"></td>
                            <td className="s20" dir="ltr" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R9" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s19" rowSpan="3">現住所</td>
                            <td className="s17" dir="ltr" colSpan="5">〒</td>
                            <td className="s25"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R10" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s17" colSpan="5"></td>
                            <td className="s11"></td>
                            <td className="s12" dir="ltr" colSpan="7"> 【自己紹介】</td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R11" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s8" colSpan="5"></td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R12" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s27">連絡先</td>
                            <td className="s20" dir="ltr" colSpan="5"></td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R13" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28">フリガナ</td>
                            <td className="s17" dir="ltr" colSpan="5"></td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R14" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s19">帰省先</td>
                            <td className="s17" dir="ltr" colSpan="5">〒</td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '27px' }}>
                            <th id="147173032R15" style={{ height: '27px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '27px' }}></div>
                            </th>
                            <td className="s27">連絡先</td>
                            <td className="s20" dir="ltr" colSpan="5"></td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R16" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s13">年</td>
                            <td className="s13">月</td>
                            <td className="s29" dir="ltr" colSpan="4">学　歴　・　職　歴</td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R17" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s30" colSpan="2">学歴</td>
                            <td className="s16"></td>
                            <td className="s17"></td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R18" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s16" dir="ltr" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34"></td>
                            <td className="s11"></td>
                            <td className="s12" colSpan="7"> 【趣味・特技】</td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R19" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s16" dir="ltr" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34"></td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" dir="ltr" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R20" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s16" dir="ltr" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34"></td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R21" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s16" dir="ltr" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34"></td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s17" colSpan="6"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R22" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s16" dir="ltr" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34"></td>
                            <td className="s11"></td>
                            <td className="s31 softmerge">
                                <div className="softmerge-inner" style={{ width: '70px', left: '-1px' }}> 【希望職種・勤務地】</div>
                            </td>
                            <td className="s32"></td>
                            <td className="s32"></td>
                            <td className="s33"></td>
                            <td className="s33"></td>
                            <td className="s33"></td>
                            <td className="s12"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R23" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28"></td>
                            <td className="s28"></td>
                            <td className="s16" dir="ltr" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34" dir="ltr"></td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s24" dir="ltr" colSpan="6"> 希望職種:</td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R24" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s35"></td>
                            <td className="s35"></td>
                            <td className="s16" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34" dir="ltr"></td>
                            <td className="s11"></td>
                            <td className="s24"></td>
                            <td className="s20" dir="ltr" colSpan="6">希望勤務地:</td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R25" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s35"></td>
                            <td className="s35"></td>
                            <td className="s30" colSpan="2">職歴</td>
                            <td className="s16"></td>
                            <td className="s17"></td>
                            <td className="s25"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R26" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s36"></td>
                            <td className="s36" dir="ltr"></td>
                            <td className="s24">なし</td>
                            <td className="s24"></td>
                            <td className="s24"></td>
                            <td className="s37" dir="ltr"></td>
                            <td className="s11"></td>
                            <td className="s12" dir="ltr" colSpan="7"> 【主な履修科目】</td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R27" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s13">年</td>
                            <td className="s13">月</td>
                            <td className="s29" dir="ltr" colSpan="4">免　許　・　資　格</td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s16"></td>
                            <td className="s16"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s16"></td>
                            <td className="s12"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R28" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s30" colSpan="2">資格</td>
                            <td className="s16"></td>
                            <td className="s17"></td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s16"></td>
                            <td className="s16"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s16"></td>
                            <td className="s12"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R29" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s16" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34" dir="ltr"></td>
                            <td className="s11"></td>
                            <td className="s16"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s16"></td>
                            <td className="s16"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s16"></td>
                            <td className="s12"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R30" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s16" dir="ltr" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34"></td>
                            <td className="s11"></td>
                            <td className="s24"></td>
                            <td className="s24" dir="ltr"></td>
                            <td className="s24"></td>
                            <td className="s24"></td>
                            <td className="s24" dir="ltr"></td>
                            <td className="s24"></td>
                            <td className="s20"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R31" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s16" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34"></td>
                            <td className="s25"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                            <td className="s26"></td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R32" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s16" colSpan="2"></td>
                            <td className="s16"></td>
                            <td className="s34" dir="ltr"></td>
                            <td className="s11"></td>
                            <td className="s28" dir="ltr" colSpan="2">健康状態</td>
                            <td className="s38" dir="ltr" colSpan="2"></td>
                            <td className="s28" dir="ltr">配偶者</td>
                            <td className="s17" colSpan="2">　無　　　（配偶者を除く扶養家族数　　　0　人）</td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R33" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}>
                                </div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s30" dir="ltr" colSpan="2">受賞</td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s17" dir="ltr"></td>
                            <td className="s11"></td>
                            <td className="s27" dir="ltr" colSpan="2">通勤時間</td>
                            <td className="s39" dir="ltr" colSpan="2">　約　　時間　　分 </td>
                            <td className="s20" dir="ltr" colSpan="3">経路：乗車駅(　　　　　　　　　　）　～　降車駅（　　　　　　　　　　　）</td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R34" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s35" dir="ltr"></td>
                            <td className="s35" dir="ltr"></td>
                            <td className="s16" dir="ltr" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34"></td>
                            <td className="s11"></td>
                            <td className="s40 softmerge" colSpan="5">
                                <div className="softmerge-inner" style={{ width: '171px', left: '-1px' }}>　保護者（本人が未成年の場合のみ記入）</div>
                            </td>
                            <td className="s44"></td>
                            <td className="s45">電話番号</td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R35" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s16" dir="ltr" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34"></td>
                            <td className="s11"></td>
                            <td className="s46" colSpan="6">ふりがな</td>
                            <td className="s17">（　　 　　）　-</td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R36" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s28" dir="ltr"></td>
                            <td className="s28" dir="ltr"></td>
                            <td className="s16" dir="ltr" colSpan="2"></td>
                            <td className="s16" dir="ltr"></td>
                            <td className="s34"></td>
                            <td className="s11"></td>
                            <td className="s47" colSpan="3"> 氏 名</td>
                            <td className="s48" colSpan="4">住所　〒</td>
                        </tr>
                        <tr style={{ height: '26px' }}>
                            <th id="147173032R37" style={{ height: '26px' }} className="row-headers-background">
                                <div className="row-header-wrapper" style={{ lineHeight: '26px' }}></div>
                            </th>
                            <td className="s27" dir="ltr"></td>
                            <td className="s27" dir="ltr"></td>
                            <td className="s24" dir="ltr" colSpan="2"></td>
                            <td className="s24" dir="ltr"></td>
                            <td className="s37" dir="ltr"></td>
                            <td className="s11"></td>
                            <td className="s27" colSpan="3"></td>
                            <td className="s49" colSpan="4"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
            {/* onclick属性はReactのonClickハンドラに変更 */}
            <div className='resume_bun_position'>
                <button className='btn_position_pdf' onClick={handlePdfClick}>pdfで保存</button>
                <button className='btn_position_png' onClick={handlePngClick}>pngで保存</button>
            </div>

           
        </>
    );
};

export default ResumeA3;