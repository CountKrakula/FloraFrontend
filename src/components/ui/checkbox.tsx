import type { ChangeEventHandler } from "react";
import { cn } from "cn"

interface InputCheckboxProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  disabled: boolean;
}

export default function InputCheckbox({
  id,
  name,
  label,
  checked,
  onChange,
  disabled,
}: InputCheckboxProps) {
  return (
    <div className="flex-row checkbox-row">
      <input
        type="checkbox"
        id={id}
        name={name}
        className="circle-checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={id} className="checkbox-label">
        {label}
      </label>
    </div>
  );
}