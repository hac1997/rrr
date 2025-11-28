import React from 'react';
import { InputField } from '@/components/ui/InputField';
import { FormLabel } from '@/components/ui/FormLabel';
import { TagButton } from '@/components/ui/TagButton';
import { RegisterStepProps } from '@/lib/types';
import { preferenceTags } from '@/lib/services/getDataseService';

export const OrganizationForm: React.FC<RegisterStepProps> = ({ formData, onInputChange, onTagToggle }) => (
  <>
    <h3 className="text-xl font-semibold text-gray-700 mb-4">Dados da Organização</h3>
    <div className="space-y-4">
      <div>
        <FormLabel htmlFor="org-name">Nome da Organização</FormLabel>
        <InputField
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="ONG Exemplo de Ajuda"
          required
        />
      </div>
      <div>
        <FormLabel htmlFor="cnpj">CNPJ (apenas números)</FormLabel>
        <InputField
          type="text"
          name="cnpj"
          value={formData.cnpj}
          onChange={onInputChange}
          placeholder="00.000.000/0001-00"
          required
        />
      </div>
      <div>
        <FormLabel htmlFor="org-email">E-mail</FormLabel>
        <InputField
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          placeholder="contato@ongexemplo.org"
          required
        />
      </div>
      <div>
        <FormLabel htmlFor="org-phone">Telefone</FormLabel>
        <InputField
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onInputChange}
          placeholder="(00) 00000-0000"
          required
        />
      </div>
      <div>
        <FormLabel htmlFor="org-password">Crie uma Senha</FormLabel>
        <InputField
          type="password"
          name="password"
          value={formData.password}
          onChange={onInputChange}
          placeholder="Mínimo 6 caracteres"
          required
        />
      </div>
      <div className="flex space-x-4">
        <div className="w-3/4">
          <FormLabel htmlFor="city">Cidade</FormLabel>
          <InputField
            type="text"
            name="city"
            value={formData.city}
            onChange={onInputChange}
            placeholder="Cidade"
            required
          />
        </div>
        <div className="w-1/4">
          <FormLabel htmlFor="state">UF</FormLabel>
          <InputField
            type="text"
            name="state"
            value={formData.state}
            onChange={onInputChange}
            placeholder="UF"
            required
            maxLength={2}
            className="uppercase text-center"
          />
        </div>
      </div>
      <div>
        <FormLabel htmlFor="preferences">Áreas de Atuação</FormLabel>
        <p className="text-sm text-gray-500 mb-3">Selecione as causas que sua organização apoia</p>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg border-gray-200">
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
      </div>
      <div className="flex items-start">
        <input
          id="orgTermsAccepted"
          name="termsAccepted"
          type="checkbox"
          required
          checked={formData.termsAccepted}
          onChange={onInputChange}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
        />
        <label htmlFor="orgTermsAccepted" className="ml-2 block text-sm font-medium text-gray-700">
          Li e aceito os{' '}
          <a href="#" className="text-primary hover:brightness-90 font-semibold">
            Termos de Serviço
          </a>{' '}
          para Organizações.
        </label>
      </div>
    </div>
  </>
);
