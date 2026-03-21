function Toast({ message, tone = "error", onClose }) {
  const tones = {
    error: "border-red-200 bg-red-50 text-red-900",
    success: "border-green-200 bg-green-50 text-green-900",
  };

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm">
      <div
        className={`rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${tones[tone]}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium">{message}</p>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70 transition hover:opacity-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;
