import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import Header from "../components/layout/Header";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import UploadDropzone from "../components/ui/UploadDropzone";
import {
  downloadInvoiceBlob,
  uploadInvoice,
} from "../services/invoiceService";
import { validateInvoiceFile } from "../utils/fileValidation";

function Home() {
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const abortRef = useRef(null);
  const downloadRef = useRef(null);

  const resetState = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    downloadRef.current = null;
    setStatus("idle");
    setErrorMessage("");
    setDownloadName("");
    setSelectedFile(null);
  };

  const handleFileSelect = async (file) => {
    setSelectedFile(file || null);

    const validation = validateInvoiceFile(file);

    if (!validation.valid) {
      setStatus("error");
      setErrorMessage(validation.message);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("uploading");
    setErrorMessage("");
    setDownloadName("");
    downloadRef.current = null;

    try {
      const { blob, filename } = await uploadInvoice(file, {
        signal: controller.signal,
      });

      // Keep the generated file in memory so users can trigger the download again.
      downloadRef.current = { blob, filename };
      downloadInvoiceBlob(blob, filename);
      setDownloadName(filename);
      setStatus("success");
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setStatus("error");
    } finally {
      abortRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f8fa_0%,_#eef2f7_100%)]">
      <Header />

      <main className="mx-auto flex min-h-[calc(100vh-81px)] max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted ring-1 ring-slate-200">
                Invoice Automation
              </span>
              <div className="space-y-3">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                  Upload invoices. Get Excel in seconds.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted">
                  Built for accountants and businesses to save hours of manual
                  work.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-panel sm:p-6">
              {status === "uploading" ? (
                <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-line bg-slate-50 px-6">
                  <Loader />
                </div>
              ) : (
                <UploadDropzone
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  disabled={status === "uploading"}
                />
              )}
            </div>
          </section>

          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-panel">
              <h2 className="text-lg font-semibold text-ink">Processing status</h2>
              <p className="mt-2 text-sm text-muted">
                Clear status feedback keeps operators confident during each file
                upload.
              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                {status === "idle" && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-ink">Ready to upload</p>
                    <p className="text-sm text-muted">
                      Upload one invoice file. Supported formats: PDF, PNG, JPG.
                    </p>
                    <p className="text-sm text-muted">Maximum file size: 10MB.</p>
                  </div>
                )}

                {status === "uploading" && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-ink">Processing</p>
                    <p className="text-sm text-muted">{selectedFile?.name}</p>
                    <p className="text-sm text-muted">
                      Upload is locked until your Excel file is ready.
                    </p>
                  </div>
                )}

                {status === "success" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                      <div>
                        <p className="text-sm font-semibold text-success">
                          Excel file is ready!
                        </p>
                        <p className="text-sm text-muted">
                          Your Excel file started downloading automatically.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-5 w-5 text-success" />
                        <div>
                          <p className="text-sm font-medium text-ink">
                            {downloadName}
                          </p>
                          <p className="text-xs text-muted">Excel output ready</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="success"
                      className="w-full"
                      onClick={() => {
                        if (downloadRef.current) {
                          downloadInvoiceBlob(
                            downloadRef.current.blob,
                            downloadRef.current.filename,
                          );
                        }
                      }}
                    >
                      Download Excel again
                    </Button>
                  </div>
                )}

                {status === "error" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 text-danger" />
                      <div>
                        <p className="text-sm font-semibold text-danger">
                          Something went wrong. Please try again.
                        </p>
                        <p className="text-sm text-muted">{errorMessage}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-muted">
                      {selectedFile?.name
                        ? `Last file: ${selectedFile.name}`
                        : "Try uploading a valid invoice file again."}
                    </div>

                    <Button variant="secondary" className="w-full" onClick={resetState}>
                      Retry
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-white p-6 shadow-panel">
              <h2 className="text-lg font-semibold text-ink">Why teams trust this</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                <li>Your data is processed securely.</li>
                <li>Files are not stored permanently.</li>
                <li>Used by small businesses and accountants.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Home;
