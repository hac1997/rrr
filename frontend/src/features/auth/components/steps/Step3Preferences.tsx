import React from 'react';
import { TagButton } from '@/components/ui/TagButton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { RegisterStepProps } from '@/lib/types';
import { preferenceTags } from '@/lib/services/getDataseService';

export const Step3Preferences: React.FC<RegisterStepProps> = ({
  formData,
  isStepValid,
  onTagToggle,
}) => (
  <>
    <h3 className="text-xl font-semibold text-gray-700 mb-4">
      Passo 3: Suas Causas 💖
    </h3>
    <p className="text-sm text-gray-500 mb-4">
      Selecione as áreas que mais te interessam para receber oportunidades relevantes.
    </p>
    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg border-gray-200">
      {preferenceTags.map(tag => (
        <TagButton
          key={tag.id}
          id={tag.id}
          label={tag.label}
          isSelected={formData.preferences.includes(tag.id)}
          onClick={onTagToggle!}
        />
      ))}
    </div>
    <ErrorMessage
      show={!isStepValid}
      message="Por favor, selecione pelo menos uma causa."
    />
  </>
);
