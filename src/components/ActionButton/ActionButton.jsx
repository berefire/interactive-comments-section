const base =
  "inline-flex items-center justify-center gap-2 font-body font-medium text-base cursor-pointer transition-opacity hover:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-3 py-1";

const variants = {
  default: "text-purple-600 focus-ring focus-ring-purple-600",
  danger: "text-pink-400 focus-ring focus-ring-pink-400",
};

function ActionButton({
  icon,
  variant = "default",
  className = "",
  children,
  ...props
}) {
  const classes = [base, variants[variant] ?? variants.default, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classes} {...props}>
      {icon && <img src={icon} alt="" aria-hidden="true" />}
      {children}
    </button>
  );
}

export default ActionButton;
