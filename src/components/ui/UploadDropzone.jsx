import { useRef } from "react";
import { FileUp, FileText, Image as ImageIcon, Paperclip } from "lucide-react";

function formatFileSize(sizeInBytes) {
  const sizeInMb = sizeInBytes / (1024 * 1024);

  if (sizeInMb >= 1) {
    return `${sizeInMb.toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(sizeInBytes / 1024))} KB`;
}

function UploadDropzone({ onFileSelect, selectedFiles, disabled = false }) {
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const nextFiles = Array.from(files || []);

    if (nextFiles.length) {
      onFileSelect(nextFiles);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className={`rounded-3xl border border-dashed p-6 text-center shadow-panel transition sm:p-10 ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-80"
          : "cursor-pointer border-line bg-white hover:border-slate-400"
      }`}
      onClick={() => {
        if (!disabled) {
          inputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(event) => {
        if (!disabled && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      aria-disabled={disabled}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-ink">
          <FileUp className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-ink">
            Upload Invoices (PDF, PNG, JPG)
          </h2>
          <p className="text-sm text-muted">Max size: 10MB</p>
          <p className="text-sm text-muted">
            Drag and drop files here, or click to browse.
          </p>
        </div>

        {selectedFiles?.length ? (
          <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left">
            <div className="flex items-start gap-3">
              <Paperclip className="mt-0.5 h-4 w-4 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">
                  {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
                </p>
                <div className="mt-2 space-y-1">
                  {selectedFiles.slice(0, 3).map((file) => (
                    <p key={`${file.name}-${file.size}`} className="truncate text-xs text-muted">
                      {file.name} ({formatFileSize(file.size)})
                    </p>
                  ))}
                  {selectedFiles.length > 3 ? (
                    <p className="text-xs text-muted">
                      +{selectedFiles.length - 3} more file
                      {selectedFiles.length - 3 > 1 ? "s" : ""}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-muted">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
            <FileText className="h-4 w-4" />
            PDF
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
            <ImageIcon className="h-4 w-4" />
            PNG
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
            <ImageIcon className="h-4 w-4" />
            JPG
          </span>
        </div>
      </div>
    </div>
  );
}

export default UploadDropzone;
