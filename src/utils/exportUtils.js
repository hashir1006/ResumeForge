import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportToPDF(element) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: 'letter',
  });

  const pageWidth = 8.5;
  const pageHeight = 11;
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Handle multi-page
  let y = 0;
  let page = 0;
  while (y < imgHeight) {
    if (page > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, -y, imgWidth, imgHeight);
    y += pageHeight;
    page++;
  }

  pdf.save('resume.pdf');
}

export async function exportToImage(element, format = 'png') {
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const ext = format === 'jpeg' ? 'jpg' : 'png';

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, mimeType, 0.95);
}

export function printResume() {
  window.print();
}
