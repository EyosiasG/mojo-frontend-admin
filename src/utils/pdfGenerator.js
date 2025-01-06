import { PDFDocument, rgb } from 'pdf-lib';

// Utility function to generate PDF for user details
export async function generateUserPDF(userData, imgElement) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 600]);
  
  // Try to embed image if available
  let embeddedImage = null;
  if (imgElement) {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.naturalWidth;
      canvas.height = imgElement.naturalHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Ensure image is loaded
      await new Promise((resolve) => {
        if (imgElement.complete) resolve(true);
        else imgElement.onload = () => resolve(true);
      });

      ctx.drawImage(imgElement, 0, 0);
      const pngData = canvas.toDataURL('image/png').split(',')[1];
      const imageBytes = Uint8Array.from(atob(pngData), c => c.charCodeAt(0));
      embeddedImage = await pdfDoc.embedPng(imageBytes);
    } catch (err) {
      console.error('Failed to embed image:', err);
    }
  }

  // Draw image if successfully embedded
  if (embeddedImage) {
    const imageWidth = 100;
    const imageHeight = 100;
    page.drawImage(embeddedImage, {
      x: (page.getWidth() - imageWidth) / 2,
      y: 400,
      width: imageWidth,
      height: imageHeight,
    });
  }

  // Add header, details and footer
  drawPDFContent(page, userData);

  return await pdfDoc.save();
}

// Helper function to draw PDF content
function drawPDFContent(page, userData) {
  // Header Section
  page.drawRectangle({
    x: 0,
    y: 500,
    width: 600,
    height: 60,
    color: rgb(0.2, 0.4, 0.6),
  });
  
  page.drawText('User Details', {
    x: 50,
    y: 520,
    size: 30,
    color: rgb(1, 1, 1),
  });

  // User details section
  let yPosition = 370;
  const details = [
    { label: 'User ID', value: userData?.id || 'N/A' },
    { label: 'First Name', value: userData?.first_name || 'N/A' },
    { label: 'Last Name', value: userData?.last_name || 'N/A' },
    { label: 'Email', value: userData?.email || 'N/A' },
    { label: 'Phone', value: userData?.phone || 'N/A' },
    { label: 'Status', value: userData?.status || 'Active' },
    {
      label: 'Registration Date',
      value: userData?.created_at
        ? new Date(userData.created_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
        : 'N/A'
    },
  ];

  details.forEach((detail) => {
    page.drawText(`${detail.label}:`, { x: 50, y: yPosition, size: 10, color: rgb(0, 0, 0) });
    page.drawText(String(detail.value), { x: 150, y: yPosition, size: 10, color: rgb(0, 0, 0) });
    yPosition -= 20;
  });

  // Footer
  drawFooter(page, yPosition);
}

// Helper function to draw footer
function drawFooter(page, yPosition) {
  page.drawLine({
    start: { x: 50, y: yPosition - 10 },
    end: { x: 350, y: yPosition - 10 },
    color: rgb(0.8, 0.8, 0.8),
    thickness: 1,
  });
  yPosition -= 30;

  page.drawText('Mojo Money Transfer!', {
    x: 225,
    y: yPosition,
    size: 12,
    color: rgb(0, 0, 0),
  });

  page.drawText('Contact us: support@mojo.com', {
    x: 210,
    y: yPosition - 20,
    size: 10,
    color: rgb(0.5, 0.5, 0.5),
  });
}

// Function to generate transaction PDF
export async function generateTransactionPDF(transaction) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  
  // Draw the content
  drawTransactionPDFContent(page, transaction);
  
  return await pdfDoc.save();
}

// Helper function to draw transaction PDF content
function drawTransactionPDFContent(page, transaction) {
  // Header Section
  page.drawRectangle({
    x: 0,
    y: 340,
    width: 600,
    height: 60,
    color: rgb(0.2, 0.4, 0.6),
  });
  
  page.drawText('Transaction Details', {
    x: 200,
    y: 360,
    size: 20,
    color: rgb(1, 1, 1),
  });

  // Transaction Details Section
  let yPosition = 300;
  page.drawText('Transaction Details:', {
    x: 50,
    y: yPosition,
    size: 12,
    color: rgb(0, 0, 0),
  });
  yPosition -= 10;

  // Horizontal line
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: 550, y: yPosition },
    color: rgb(0.8, 0.8, 0.8),
    thickness: 1,
  });
  yPosition -= 20;

  // Transaction details
  const details = [
    { label: 'Transaction ID', value: String(transaction.transaction_id || 'N/A') },
    { label: 'Sender Name', value: String(transaction.sender_name || 'N/A') },
    { label: 'Receiver Name', value: String(transaction.reciever_name || 'N/A') },
    { label: 'Account Number', value: String(transaction.account_number || 'N/A') },
    { label: 'Amount', value: `$${transaction.amount || 'N/A'}` },
    { label: 'Amount in ETB', value: `${transaction.etb_amount || 'N/A'} ETB` },
    { label: 'Status', value: String(transaction.status || 'Active') },
  ];

  details.forEach((detail) => {
    page.drawText(`${detail.label}:`, { x: 50, y: yPosition, size: 10, color: rgb(0, 0, 0) });
    page.drawText(String(detail.value), { x: 300, y: yPosition, size: 10, color: rgb(0, 0, 0) });
    yPosition -= 20;
  });

  // Draw footer
  drawTransactionFooter(page, yPosition);
}

// Helper function to draw transaction footer
function drawTransactionFooter(page, yPosition) {
  page.drawLine({
    start: { x: 50, y: yPosition - 10 },
    end: { x: 550, y: yPosition - 10 },
    color: rgb(0.8, 0.8, 0.8),
    thickness: 1,
  });
  yPosition -= 30;

  page.drawText('Mojo Money Transfer!', {
    x: 225,
    y: yPosition,
    size: 12,
    color: rgb(0, 0, 0),
  });

  page.drawText('Contact us: support@mojo.com', {
    x: 210,
    y: yPosition - 20,
    size: 10,
    color: rgb(0.5, 0.5, 0.5),
  });
} 