import { Document, Page } from "react-pdf";
import { useState } from "react";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';


function PdfViewer({pdf}) {
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoaded({ numPages }) {
        console.log("Document Loaded", numPages);
        setNumPages(numPages);
        setPageNumber(1);

    }
    function nextPage() {
        setPageNumber((prev) => (prev < numPages ? prev + 1 : prev))
    }
    function prevPage() {
        setPageNumber((prev) => (prev > 1 ? prev - 1 : prev))
    }
    return (
        <div>
            <Document file={pdf} onLoadSuccess={onDocumentLoaded}>
                <Page pageNumber={pageNumber}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                // scale={1.5} 
                // rotate={90} 
                // width={200} 
                // height={200} 
                />
            </Document>
            <div className="pdf-controls">
                <button className="btn btn-primary" onClick={prevPage} disabled={pageNumber <= 1}>
                    ◀ Prev
                </button>
                <span>
                    Page {pageNumber} of {numPages}
                </span>
                <button className="btn btn-primary" onClick={nextPage} disabled={pageNumber >= numPages}>
                    Next ▶
                </button>
            </div>
        </div>
    )
}
export default PdfViewer;