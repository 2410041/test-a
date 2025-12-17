// school.js（ブラウザ向け）
// 注意: このスクリプトは html2canvas と jsPDF を CDN 経由で読み込んだ後に実行されることを想定しています。

/**
 * .waffle.no-grid 要素をキャプチャして PDF に変換し、ダウンロードをトリガーします。
 *
 * 手順の概要:
 * 1. html2canvas で対象要素を canvas にレンダリング
 * 2. canvas を画像データ（JPEG）に変換
 * 3. 画像を A4 幅に合わせて jsPDF に追加
 * 4. 画像の高さが A4 ページを超える場合は、同じ大きな画像をページごとにオフセットして追加することで複数ページに分割
 */
function generatePdf() {
  // 対象要素を取得
  const targetElement = document.querySelector('.waffle.no-grid');
  if (!targetElement) {
    // 要素が見つからない場合はエラーを出して終了
    console.error('指定された要素 (.waffle.no-grid) が見つかりません。');
    alert('指定された要素 (.waffle.no-grid) が見つかりません。ページ内の該当要素を確認してください。');
    return;
  }

  // html2canvas で要素を画像化します。
  // scale:2 は高解像度（Retina 対応）を狙ったものです。
  // useCORS:true を指定すると、CORS 設定が正しい外部画像は描画可能になります。
  html2canvas(targetElement, { scale: 2, useCORS: true })
    .then(canvas => {
      // Canvas を JPEG データ URL に変換
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // A4 サイズ（mm 単位）
      const pageWidthMM = 210; // 幅
      const pageHeightMM = 297; // 高さ

      // canvas のピクセルサイズから、A4 幅に合わせたときの画像高さ（mm 単位）を計算
      const imgWidthPX = canvas.width;
      const imgHeightPX = canvas.height;
      const imgHeightMM = (imgHeightPX * pageWidthMM) / imgWidthPX;

      // jsPDF のコンストラクタを取得（CDN で読み込まれた場合はいずれかのグローバルに入る）
      const jsPDFConstructor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
      if (!jsPDFConstructor) {
        alert('jsPDF が読み込まれていません。スクリプトの読み込み順を確認してください。');
        return;
      }

      // A4 縦（mm 単位）で PDF を作成
      const pdf = new jsPDFConstructor('p', 'mm', 'a4');

      // まずは最初のページに画像全体を A4 幅で描画（高さは imgHeightMM）
      // 高さが A4 を超える場合は次のループで追加ページを生成します。
      let heightLeft = imgHeightMM;
      let position = 0; // 描画開始 Y オフセット（mm）

      pdf.addImage(imgData, 'JPEG', 0, position, pageWidthMM, imgHeightMM);
      heightLeft -= pageHeightMM;

      // 残りの高さがある場合、同じ画像を Y オフセットして追加することでページ分割する
      // （canvas 自体をスライスする方法もあるが、こちらは簡易的かつ互換性の高い手法）
      while (heightLeft > 0) {
        position = position - pageHeightMM; // 次ページでは画像を上にずらして描画
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pageWidthMM, imgHeightMM);
        heightLeft -= pageHeightMM;
      }

      // PDF を保存（ダウンロード）
      pdf.save('waffle_no_grid_data.pdf');
    })
    .catch(err => {
      // 何らかの理由でキャプチャや PDF 生成に失敗した場合
      console.error('PDF 作成中にエラーが発生しました', err);
      alert('PDF 作成に失敗しました。詳細はコンソールを確認してください。');
    });
}

// inline の onclick="pdf()" から呼び出せるようにグローバルに公開
function pdf(){
  generatePdf();
}

window.pdf = pdf;

// モジュール環境で使いたい場合は generatePdf をエクスポートしても良い
// export { generatePdf };