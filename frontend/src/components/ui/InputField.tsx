import React from 'react';

interface InputFieldProps {
  type: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
  min?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  required,
  value,
  defaultValue,
  onChange,
  className = '',
  maxLength,
  min,
}) => {
  // Se value está definido, é controlado. Se não, usa defaultValue (não controlado)
  const isControlled = value !== undefined;

  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      {...(isControlled ? { value } : { defaultValue })}
      onChange={onChange}
      maxLength={maxLength}
      min={min}
      className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all ${className}`}
    />
  );
};