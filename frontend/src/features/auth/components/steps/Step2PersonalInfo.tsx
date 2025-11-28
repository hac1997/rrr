import React from 'react';
import { InputField } from '@/components/ui/InputField';
import { SelectField } from '@/components/ui/SelectField';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { RegisterStepProps } from '@/lib/types';
import { GENDER_OPTIONS } from '@/lib/services/getDataseService';

export const Step2PersonalInfo: React.FC<RegisterStepProps> = ({
  formData,
  isStepValid,
  onInputChange,
}) => (
  <>
    <h3 className="text-xl font-semibold text-gray-700 mb-4">Passo 2: Sobre Você</h3>
    <div className="space-y-4">
      <InputField
        type="text"
        name="name"
        value={formData.name}
        onChange={onInputChange}
        placeholder="Nome Completo"
        required
      />
      <div className="flex space-x-4">
        <InputField
          type="text"
          name="city"
          value={formData.city}
          onChange={onInputChange}
          placeholder="Cidade"
          required
          className="w-3/4"
        />
        <InputField
          type="text"
          name="state"
          value={formData.state}
          onChange={onInputChange}
          placeholder="UF"
          required
          maxLength={2}
          className="w-1/4 uppercase text-center"
        />
      </div>

      <div className="flex space-x-4">
        <div className="w-full">
          <SelectField
            name="gender"
            value={formData.gender}
            onChange={onInputChange}
            options={GENDER_OPTIONS}
            placeholder="Selecione o Sexo"
            required
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <InputField
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            const formatted = value
              .replace(/(\d{3})(\d)/, '$1.$2')
              .replace(/(\d{3})(\d)/, '$1.$2')
              .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            onInputChange({ ...e, target: { ...e.target, name: 'cpf', value: formatted } });
          }}
          placeholder="000.000.000-00"
          required
          maxLength={14}
          className="w-1/2"
        />
        <InputField
          type="text"
          name="birthDate"
          value={formData.birthDate}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            const formatted = value
              .replace(/(\d{2})(\d)/, '$1/$2')
              .replace(/(\d{2})(\d)/, '$1/$2');
            onInputChange({ ...e, target: { ...e.target, name: 'birthDate', value: formatted } });
          }}
          placeholder="DD/MM/AAAA"
          required
          maxLength={10}
          className="w-1/2"
        />
      </div>
      <InputField
        type="text"
        name="phone"
        value={formData.phone}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          const formatted = value
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
          onInputChange({ ...e, target: { ...e.target, name: 'phone', value: formatted } });
        }}
        placeholder="(00) 00000-0000"
        required
        maxLength={15}
      />
      <ErrorMessage
        show={!isStepValid}
        message="Por favor, preencha todos os campos corretamente."
      />
    </div >
  </>
);
