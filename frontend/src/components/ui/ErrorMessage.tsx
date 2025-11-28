import React from 'react';

interface ErrorMessageProps {
  message: string;
  show: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, show }) =>
  show ? <p className="text-red-500 text-sm">{message}</p> : null;
