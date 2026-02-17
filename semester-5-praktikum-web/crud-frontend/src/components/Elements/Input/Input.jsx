import React from "react";

const Input = (props) => {
  const { type, placeholder, value, onChange } = props;
  return (
    <input
      type={type}
      className="grow"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
