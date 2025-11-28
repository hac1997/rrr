import React from 'react';
import { User, Briefcase } from 'lucide-react';
import { RegisterType } from '@/lib/types';

interface TypeSelectorProps {
  registerType: RegisterType;
  onTypeChange: (type: RegisterType) => void;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  registerType,
  onTypeChange,
}) => (
  <div className="flex justify-center space-x-4 mb-8">
    <button
      type="button"
      onClick={() => onTypeChange('volunteer')}
      className={`py-2 px-4 rounded-full transition-all duration-300 font-semibold ${
        registerType === 'volunteer'
          ? 'bg-primary text-white shadow-lg'
          : 'bg-gray-100 text-gray-600 hover:bg-aux-2 hover:text-primary'
      }`}
    >
      <User className="inline h-4 w-4 mr-2" /> Sou Voluntário
    </button>
    <button
      type="button"
      onClick={() => onTypeChange('organization')}
      className={`py-2 px-4 rounded-full transition-all duration-300 font-semibold ${
        registerType === 'organization'
          ? 'bg-primary text-white shadow-lg'
          : 'bg-gray-100 text-gray-600 hover:bg-aux-2 hover:text-primary'
      }`}
    >
      <Briefcase className="inline h-4 w-4 mr-2" /> Sou Organização
    </button>
  </div>
);
