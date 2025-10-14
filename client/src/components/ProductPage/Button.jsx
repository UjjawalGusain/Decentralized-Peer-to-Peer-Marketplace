import React from "react";

const Button = ({ label, onSubmit, type = "button", padding, color="bg-slate-800" }) => {
  // Map numeric padding or string to Tailwind classes
  const paddingClass =
    {
      1: "px-1",
      2: "px-2",
      3: "px-3",
      4: "px-4",
      5: "px-5",
      6: "px-6",
      7: "px-7",
      8: "px-8",
      9: "px-9",
      10: "px-10",
    }[padding] || "px-4";

  return (
    <button
      type={type}
      onClick={onSubmit}
      className={`rounded-md ${color} py-2 ${paddingClass} border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2`}
    >
      {label}
    </button>
  );
};

export default Button;
