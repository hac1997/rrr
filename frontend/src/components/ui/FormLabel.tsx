import React from 'react';

interface FormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

export const FormLabel: React.FC<FormLabelProps> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);
