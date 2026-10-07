const base =
  "inline-flex items-center justify-center rounded-[0.5rem] cursor-pointer transition-opacity hover:opacity-50 px-7.5 py-3 font-body uppercase text-white font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-purple-600 focus-ring focus-ring-purple-600",
  neutral: "bg-grey-500 focus-ring focus-ring-grey-500",
  danger: "bg-pink-400 focus-ring focus-ring-pink-400",
};

function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  type = "button",
  children,
  ...props
}) {

    const classes = [ base, variants[variant]?? variants.primary, fullWidth ? "w-full" : "", className].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
