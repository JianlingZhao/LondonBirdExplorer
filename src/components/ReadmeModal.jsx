import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import readme from "/README.md?raw";

function ReadmeModal({ onClose }) {
  return (
    <div className="readme-overlay" onClick={onClose}>
      <div
        className="readme-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="readme-close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="readme-content">

          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {readme}
          </ReactMarkdown>

        </div>

      </div>
    </div>
  );
}

export default ReadmeModal;