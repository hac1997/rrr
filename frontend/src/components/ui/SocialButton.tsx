import React from 'react';
import Image from 'next/image'

interface SocialButtonProps {
  provider: string;
  logoUrl: string;
  onClick?: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  logoUrl,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (provider.toLowerCase() === 'google') {
      window.location.href = 'http://localhost:8080/api/v1/oauth2/authorization/google';
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
    >
      <Image
        src={logoUrl}
        alt={`${provider} logo`}
        width={20}
        height={20}
        className="mr-2"
      />
      Entrar com {provider}
    </button>
  );
};