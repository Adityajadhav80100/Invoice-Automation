import { useEffect, useState } from "react";

const PROCESSING_MESSAGES = [
  "Analyzing invoice...",
  "Extracting GST details...",
  "Preparing Excel file...",
];

function Loader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Rotating short messages reassures non-technical users that work is progressing.
    const intervalId = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % PROCESSING_MESSAGES.length);
    }, 2400);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">
          {PROCESSING_MESSAGES[messageIndex]}
        </p>
        <p className="text-sm text-muted">
          This usually takes 10-15 seconds.
        </p>
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}

export default Loader;
