import React from "react";

const Label = ({ label, children }) => {
  return (
    <label className="input input-bordered flex items-center gap-2">
      {label}
      {children}
    </label>
  );
};

export default Label;
