document.addEventListener('DOMContentLoaded', function() {
    const cap = document.getElementById('capture');
    const widht = document.getElementById('getwidht');
    const bodywidht = widht.offsetWidth;
    console.log(bodywidht);
    if(bodywidht<1300){
        console.log("小さい");
    }else{
        console.log("いい感じ");
        cap.style.marginLeft = (bodywidht - 1350) / 2 + 'px';

        window.addEventListener('resize', function() {
            const updated = widht.offsetWidth;
            cap.style.marginLeft = (updated - 1350) / 2 + 'px';
            console.log(updated);
            
        });
    }
});
function capture() {
    const element = document.getElementById('capture');
    const pdfWidth = 1300; // PDFの幅 (必要に応じて調整)
    const pdfHeight = 1000; // PDFの高さ (必要に応じて調整)

    html2canvas(element, { width: pdfWidth, height: pdfHeight }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: (pdfWidth > pdfHeight) ? 'landscape' : 'portrait', // 横長ならlandscape、縦長ならportrait
            unit: 'px',
            format: [pdfWidth, pdfHeight]
        });
        console.log(pdfWidth);
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('konnichiwa.pdf');
    });
}