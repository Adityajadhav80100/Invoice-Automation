const MAX_TIMEOUT_MS = 30000;

export async function uploadInvoice(file, { signal } = {}) {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Service is temporarily unavailable. Please try again in a moment.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const timeoutController = new AbortController();
  const combinedController = new AbortController();

  const abortRequest = () => combinedController.abort();

  timeoutController.signal.addEventListener("abort", abortRequest);
  signal?.addEventListener("abort", abortRequest);

  const timeoutId = window.setTimeout(() => {
    timeoutController.abort();
  }, MAX_TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: formData,
      signal: combinedController.signal,
    });

    if (!response.ok) {
      throw new Error("Something went wrong. Please try again.");
    }

    const blob = await response.blob();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `invoice-output-${timestamp}.xlsx`;

    return { blob, filename };
  } catch (error) {
    if (timeoutController.signal.aborted) {
      throw new Error("The request took too long. Please try again.");
    }

    if (error.name === "AbortError") {
      throw new Error("Upload was interrupted. Please try again.");
    }

    throw new Error(error.message || "Something went wrong. Please try again.");
  } finally {
    window.clearTimeout(timeoutId);
    timeoutController.signal.removeEventListener("abort", abortRequest);
    signal?.removeEventListener("abort", abortRequest);
  }
}

export function downloadInvoiceBlob(blob, filename) {
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    window.URL.revokeObjectURL(downloadUrl);
  }, 1000);
}
