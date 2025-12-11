/**
 * Download Utilities
 * Client-side file generation for downloading results as TXT or PDF
 */

/**
 * Download text content as a .txt file
 */
export const downloadAsTxt = (content: string, filename: string = 'triscan-result.txt') => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Download content as a .pdf file using jsPDF
 * Note: Requires jsPDF library to be installed
 */
export const downloadAsPdf = async (content: string, filename: string = 'triscan-result.pdf') => {
  try {
    // Dynamically import jsPDF to avoid bundle bloat
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 7;
    let y = margin;

    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TriScan AI - Extracted Content', margin, y);
    y += lineHeight * 2;

    // Add timestamp
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += lineHeight * 2;

    // Add content
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    // Split content into lines that fit the page width
    const lines = doc.splitTextToSize(content, maxWidth);
    
    lines.forEach((line: string) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });

    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error('PDF generation failed. Please try downloading as TXT instead.');
  }
};

/**
 * Format filename with timestamp
 */
export const formatFilename = (prefix: string, extension: 'txt' | 'pdf') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}-${timestamp}.${extension}`;
};

/**
 * Download comparison results as formatted text
 */
export const downloadComparisonAsTxt = (result: {
  similarity: number;
  differences: string[];
  common: string[];
  unique: Record<string, string[]>;
  summary: string;
}) => {
  let content = '='.repeat(60) + '\n';
  content += 'TRISCAN AI - FILE COMPARISON RESULTS\n';
  content += '='.repeat(60) + '\n\n';
  content += `Generated: ${new Date().toLocaleString()}\n`;
  content += `Similarity Score: ${Math.round(result.similarity)}%\n\n`;

  content += '-'.repeat(60) + '\n';
  content += 'DIFFERENCES\n';
  content += '-'.repeat(60) + '\n';
  if (result.differences.length > 0) {
    result.differences.forEach((diff, i) => {
      content += `${i + 1}. ${diff}\n`;
    });
  } else {
    content += 'No differences found.\n';
  }

  content += '\n' + '-'.repeat(60) + '\n';
  content += 'COMMON CONTENT\n';
  content += '-'.repeat(60) + '\n';
  if (result.common.length > 0) {
    result.common.forEach((item, i) => {
      content += `${i + 1}. ${item}\n`;
    });
  } else {
    content += 'No common content found.\n';
  }

  content += '\n' + '-'.repeat(60) + '\n';
  content += 'UNIQUE CONTENT PER FILE\n';
  content += '-'.repeat(60) + '\n';
  Object.entries(result.unique).forEach(([fileName, items]) => {
    content += `\n${fileName}:\n`;
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item, i) => {
        content += `  ${i + 1}. ${item}\n`;
      });
    } else {
      content += '  No unique content\n';
    }
  });

  if (result.summary) {
    content += '\n' + '='.repeat(60) + '\n';
    content += 'AI SUMMARY\n';
    content += '='.repeat(60) + '\n';
    content += result.summary + '\n';
  }

  downloadAsTxt(content, formatFilename('comparison', 'txt'));
};
