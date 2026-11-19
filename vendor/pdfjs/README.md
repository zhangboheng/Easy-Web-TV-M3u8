# vendor/pdfjs

Optional local copy of pdf.js (v3.11.174 legacy build) used by the manga reader
to render local PDF files page by page.

Expected files:

- `pdf.min.js`
- `pdf.worker.min.js`

Download both from <https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/> and
place them here. When these files are missing, the reader automatically falls
back to a public CDN at runtime, so PDF support still works.
