const MAX_TIMEOUT_MS = 60000;
const EXCEL_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function formatDownloadDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function buildDefaultFilename() {
  return `invoice-data-${formatDownloadDate()}.xlsx`;
}

function parseFilenameFromDisposition(contentDisposition) {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]).replace(/["]/g, "");
  }

  const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);

  return filenameMatch?.[1] || null;
}

export async function uploadInvoice(files, { signal } = {}) {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Service is temporarily unavailable. Please try again in a moment.");
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const requestController = new AbortController();
  let didTimeout = false;

  const abortRequest = () => requestController.abort();

  signal?.addEventListener("abort", abortRequest);

  const timeoutId = window.setTimeout(() => {
    didTimeout = true;
    requestController.abort();
  }, MAX_TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: formData,
      signal: requestController.signal,
      headers: {
        Accept: EXCEL_MIME_TYPE,
      },
    });

    window.clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("The backend could not generate the Excel file.");
    }

    const contentType = response.headers.get("content-type") || "";
    const contentDisposition = response.headers.get("content-disposition");
    const filename =
      parseFilenameFromDisposition(contentDisposition) || buildDefaultFilename();

    if (
      contentType &&
      !contentType.includes(EXCEL_MIME_TYPE) &&
      !contentType.includes("application/octet-stream")
    ) {
      throw new Error(
        "Invalid file response from backend. Expected an Excel binary download.",
      );
    }

    const blob = await response.blob();

    if (!blob.size) {
      throw new Error("Received an empty Excel file from backend.");
    }

    return {
      blob:
        blob.type === EXCEL_MIME_TYPE
          ? blob
          : new Blob([blob], { type: EXCEL_MIME_TYPE }),
      filename,
      headers: {
        contentType,
        contentDisposition,
      },
    };
  } catch (error) {
    if (didTimeout) {
      throw new Error("The request took too long. Please try again.");
    }

    if (error.name === "AbortError") {
      throw new Error("Upload was interrupted. Please try again.");
    }

    throw new Error(error.message || "Something went wrong. Please try again.");
  } finally {
    window.clearTimeout(timeoutId);
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
