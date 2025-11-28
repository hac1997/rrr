import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 relative">
      <div className="absolute inset-0 bg-[url('/bg3.png')] bg-cover bg-center bg-fixed opacity-50 z-0"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
