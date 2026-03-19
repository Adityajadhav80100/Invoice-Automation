function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  const variants = {
    primary:
      "bg-ink text-white hover:bg-slate-800 focus-visible:ring-ink/20 disabled:bg-slate-300",
    secondary:
      "bg-white text-ink ring-1 ring-line hover:bg-slate-50 focus-visible:ring-ink/10 disabled:text-slate-400",
    success:
      "bg-success text-white hover:bg-green-700 focus-visible:ring-green-600/20 disabled:bg-green-300",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
