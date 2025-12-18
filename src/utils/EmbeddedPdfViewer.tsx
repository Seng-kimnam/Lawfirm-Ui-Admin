interface PdfProp {
  docId: number;
  fileUrl: string;
  title: string;
}

const EmbeddedPdfViewer = ({ docId, fileUrl, title }: PdfProp) => {
  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <iframe
        key={docId}
        src={fileUrl}
        title={title}
        width="100%"
        height="100%"
        // 'frameBorder' and 'scrolling' are deprecated in modern HTML,
        // use CSS for styling if needed.
      />
    </div>
  );
};

export default EmbeddedPdfViewer;
// Usage example:
// const url = "http://localhost:9000/lawfirm-bucket/..."
// <EmbeddedPdfViewer pdfUrl={url} title="AWS Reserve Confirmation" />
