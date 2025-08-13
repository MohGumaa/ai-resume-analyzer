// This is a simple test script to verify PDF conversion
// Run this in the browser console after navigating to the upload page

// Mock a PDF file upload
async function testPdfConversion() {
  console.log('Starting PDF conversion test...');
  
  try {
    // You would need to replace this with an actual PDF file in production
    // For testing, we'll create a simple blob that mimics a PDF file
    const pdfBlob = new Blob(['%PDF-1.5 test pdf content'], { type: 'application/pdf' });
    const pdfFile = new File([pdfBlob], 'test.pdf', { type: 'application/pdf' });
    
    // Import the conversion function
    const { convertPdfToImage } = await import('./app/lib/pdf2img.ts');
    
    console.log('Converting PDF to image...');
    const result = await convertPdfToImage(pdfFile);
    
    console.log('Conversion result:', result);
    
    if (result.file) {
      console.log('✅ PDF conversion successful!');
    } else {
      console.error('❌ PDF conversion failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testPdfConversion();