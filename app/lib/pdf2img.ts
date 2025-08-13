export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use local file
        const workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();
        lib.GlobalWorkerOptions.workerSrc = workerSrc;
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        console.log("Loading PDF.js library...");
        const lib = await loadPdfJs();
        console.log("PDF.js library loaded successfully");

        console.log("Reading PDF file...");
        const arrayBuffer = await file.arrayBuffer();
        console.log("PDF file read successfully, size:", arrayBuffer.byteLength);
        
        console.log("Parsing PDF document...");
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        console.log("PDF document parsed successfully, pages:", pdf.numPages);
        
        console.log("Getting first page...");
        const page = await pdf.getPage(1);
        console.log("First page retrieved successfully");

        const viewport = page.getViewport({ scale: 4 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error("Failed to get canvas context");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        
        console.log("Rendering PDF page to canvas...");
        await page.render({ canvasContext: context, viewport }).promise;
        console.log("PDF page rendered successfully");

        console.log("Converting canvas to PNG blob...");
        return new Promise((resolve) => {
            try {
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            console.log("Blob created successfully, size:", blob.size);
                            // Create a File from the blob with the same name as the pdf
                            const originalName = file.name.replace(/\.pdf$/i, "");
                            const imageFile = new File([blob], `${originalName}.png`, {
                                type: "image/png",
                            });
                            console.log("Image file created successfully");

                            resolve({
                                imageUrl: URL.createObjectURL(blob),
                                file: imageFile,
                            });
                        } else {
                            console.error("Failed to create image blob");
                            resolve({
                                imageUrl: "",
                                file: null,
                                error: "Failed to create image blob",
                            });
                        }
                    },
                    "image/png",
                    1.0
                ); // Set quality to maximum (1.0)
            } catch (error) {
                console.error("Error in toBlob operation:", error);
                resolve({
                    imageUrl: "",
                    file: null,
                    error: `Error in toBlob operation: ${error}`,
                });
            }
        });
    } catch (err) {
        console.error("PDF conversion failed:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}