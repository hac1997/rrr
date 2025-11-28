import React from 'react';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { RegisterStepProps } from '@/lib/types';

export const Step4Terms: React.FC<RegisterStepProps> = ({
  formData,
  isStepValid,
  onInputChange,
}) => (
  <>
    <h3 className="text-xl font-semibold text-gray-700 mb-4">
      Passo 4: Finalizar Cadastro
    </h3>
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-h-32 overflow-y-scroll text-sm text-gray-600 mb-6">
      <p className="font-semibold mb-2">Termos de Serviço e Política de Privacidade</p>
      <p>
        Ao se cadastrar na REVO, você concorda em cumprir nossos Termos de Serviço
        e em como tratamos seus dados pessoais em nossa Política de Privacidade.
        Comprometa-se a agir com ética e responsabilidade em todas as atividades
        de voluntariado...
      </p>
      <p className="mt-2">... (Conteúdo longo simulado dos termos) ...</p>
    </div>
    <div className="flex items-start">
      <input
        id="termsAccepted"
        name="termsAccepted"
        type="checkbox"
        required
        checked={formData.termsAccepted}
        onChange={onInputChange}
        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
      />
      <label htmlFor="termsAccepted" className="ml-2 block text-sm font-medium text-gray-700">
        Li e aceito os{' '}
        <a href="#" className="text-primary hover:brightness-90 font-semibold">
          Termos de Serviço
        </a>{' '}
        e a{' '}
        <a href="#" className="text-primary hover:brightness-90 font-semibold">
          Política de Privacidade
        </a>
        .
      </label>
    </div>
    <ErrorMessage
      show={!isStepValid}
      message="Você deve aceitar os termos para prosseguir."
    />
  </>
);
