function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-semibold tracking-tight text-ink">
            InvoiceFlow
          </p>
          <p className="text-sm text-muted">
            AI-powered invoice extraction for Indian businesses
          </p>
        </div>

        <p className="text-sm font-medium text-muted">Coming soon</p>
      </div>
    </header>
  );
}

export default Header;
