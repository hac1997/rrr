'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Trash2, AlertCircle, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Address, ProfileSettingsProps } from '@/lib/types';



const ProfileSettings: React.FC<ProfileSettingsProps> = ({ volunteerData }) => {
  const [formData, setFormData] = useState({
    name: volunteerData.name,
    email: volunteerData.email,
    phone: volunteerData.phone,
    cpf: '123.456.789-00',
    birthDate: '15/05/1995'
  });

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      label: 'Residencial'
    }
  ]);

  const [emails, setEmails] = useState([
    { id: 1, email: 'maria.silva@email.com', type: 'Principal' },
    { id: 2, email: 'maria.work@empresa.com', type: 'Trabalho' }
  ]);

  const [phones, setPhones] = useState([
    { id: 1, number: '(11) 98765-4321', type: 'Celular' },
    { id: 2, number: '(11) 3456-7890', type: 'Residencial' }
  ]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [showAddPhone, setShowAddPhone] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    toast.success('Dados salvos com sucesso!');
  };

  const handleDeleteAccount = () => {
    toast.success('Conta excluída. Redirecionando...');
    setShowDeleteConfirm(false);
  };

  const removeAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const removeEmail = (id: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter(e => e.id !== id));
    } else {
      toast.error('Você precisa ter pelo menos um e-mail cadastrado');
    }
  };

  const removePhone = (id: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter(p => p.id !== id));
    } else {
      toast.error('Você precisa ter pelo menos um telefone cadastrado');
    }
  };

  return (
    <div className="p-6 bg-stone-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Meus Dados</h2>
        <p className="text-gray-600">Gerencie suas informações pessoais e de contato</p>
      </div>

      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-500" />
          Informações Pessoais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
            <input
              type="text"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Email Addresses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-500" />
            E-mails
          </h3>
          <button
            onClick={() => setShowAddEmail(true)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar e-mail
          </button>
        </div>
        <div className="space-y-3">
          {emails.map(email => (
            <div key={email.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{email.email}</p>
                <p className="text-xs text-gray-500">{email.type}</p>
              </div>
              <button
                onClick={() => removeEmail(email.id)}
                className="text-gray-400 hover:text-red-500 p-1"
                title="Remover"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        {/* Add Email Modal/Form (simplified) */}
        {showAddEmail && (
          <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Novo E-mail</h4>
            <div className="flex space-x-2">
              <input type="email" placeholder="email@exemplo.com" className="flex-1 px-3 py-2 border rounded-lg" />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Adicionar</button>
              <button onClick={() => setShowAddEmail(false)} className="px-3 py-2 text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Phone Numbers */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Phone className="h-5 w-5 mr-2 text-blue-500" />
            Telefones
          </h3>
          <button
            onClick={() => setShowAddPhone(true)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar telefone
          </button>
        </div>
        <div className="space-y-3">
          {phones.map(phone => (
            <div key={phone.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{phone.number}</p>
                <p className="text-xs text-gray-500">{phone.type}</p>
              </div>
              <button
                onClick={() => removePhone(phone.id)}
                className="text-gray-400 hover:text-red-500 p-1"
                title="Remover"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        {/* Add Phone Modal/Form (simplified) */}
        {showAddPhone && (
          <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Novo Telefone</h4>
            <div className="flex space-x-2">
              <input type="text" placeholder="(99) 99999-9999" className="flex-1 px-3 py-2 border rounded-lg" />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Adicionar</button>
              <button onClick={() => setShowAddPhone(false)} className="px-3 py-2 text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-500" />
            Endereços
          </h3>
          <button
            onClick={() => setShowAddAddress(true)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar endereço
          </button>
        </div>
        <div className="space-y-3">
          {addresses.map(address => (
            <div key={address.id} className="p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{address.label}</h4>
                <button
                  onClick={() => removeAddress(address.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  title="Remover"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600">{address.street}</p>
              <p className="text-sm text-gray-600">{address.zipCode} - {address.city}, {address.state}</p>
            </div>
          ))}
        </div>
        {/* Add Address Modal/Form (simplified) */}
        {showAddAddress && (
          <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Novo Endereço</h4>
            <p className="text-sm text-gray-600 mb-3">Preencha os campos abaixo:</p>
            <div className="space-y-2">
              <input type="text" placeholder="Rua, número" className="w-full px-3 py-2 border rounded-lg" />
              <input type="text" placeholder="CEP" className="w-full px-3 py-2 border rounded-lg" />
              <div className="flex space-x-2">
                <input type="text" placeholder="Cidade" className="flex-1 px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="Estado (UF)" className="w-20 px-3 py-2 border rounded-lg" />
              </div>
              <input type="text" placeholder="Rótulo (ex: Trabalho)" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="flex justify-end space-x-2 mt-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Salvar Endereço</button>
              <button onClick={() => setShowAddAddress(false)} className="px-3 py-2 text-gray-600 border rounded-lg hover:bg-white">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações da Conta</h3>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir Minha Conta
        </button>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-primary text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center font-medium"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="flex items-center mb-4 text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Confirmar Exclusão</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;