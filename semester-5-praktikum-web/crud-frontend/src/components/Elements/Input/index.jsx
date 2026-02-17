import React from "react";
import Label from "./Label";
import Input from "./Input";

const InputForm = ({ label, type, placeholder, value, onChange }) => {
  return (
    <div className="mb-6">
      <Label label={label}>
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </Label>
    </div>
  );
};

export default InputForm;
