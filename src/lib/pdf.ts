import { pdfjs } from "react-pdf";

/**
 * Configure the pdf.js worker once for the whole application.
 * Vite resolves `new URL(..., import.meta.url)` at build time,
 * so the worker bundle is correctly hashed and served as a static asset.
 */
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url,
).toString();
