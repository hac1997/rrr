'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Users, Clock, Target, Briefcase, Gift, CheckSquare, Save, XCircle, Upload, Image as ImageIcon, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

import { createEvent, updateEvent } from '@/lib/services/event.service';
import { OrgEventSummary } from '@/lib/types';

interface EventCreationProps {
  onSuccess: () => void;
  eventToEdit?: OrgEventSummary | null;
}

interface WorkSchedule {
  date: string;
  startTime: string;
  endTime: string;
}

interface RoleDetails {
  name: string;
  responsibilities: string[];
  maxVolunteers: number;
}

// Tipo para armazenar erros de validação
interface FormErrors {
  [key: string]: string;
}

const EventCreation: React.FC<EventCreationProps> = ({ onSuccess, eventToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    objectives: '',
    benefits: '',
    maxVolunteers: '',
    location: '',
    address: '',
    city: '',
    state: ''
  });

  const [roles, setRoles] = useState<string[]>(['']);
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [rolesWithDetails, setRolesWithDetails] = useState<RoleDetails[]>([{
    name: '',
    responsibilities: [''],
    maxVolunteers: 1
  }]);
  const [useAdvancedRoles, setUseAdvancedRoles] = useState(false);
  const [schedules, setSchedules] = useState<WorkSchedule[]>([{ date: '', startTime: '', endTime: '' }]);
  const [errors, setErrors] = useState<FormErrors>({}); // Estado para erros
  // NOVO ESTADO: Controla se o usuário já tentou submeter o formulário
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Image Upload State
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (eventToEdit) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/events/${eventToEdit.id}`);
          if (response.ok) {
            const fullEvent = await response.json();
            setFormData({
              title: fullEvent.title || eventToEdit.title,
              category: eventToEdit.category,
              description: fullEvent.description || '',
              objectives: '',
              benefits: '',
              maxVolunteers: fullEvent.volunteerSlots?.toString() || eventToEdit.maxVolunteers.toString(),
              location: eventToEdit.location,
              address: fullEvent.address?.street || '',
              city: fullEvent.address?.city || '',
              state: fullEvent.address?.state || ''
            });
          } else {
            // Fallback to summary data if fetch fails
            setFormData({
              title: eventToEdit.title,
              category: eventToEdit.category,
              description: '',
              objectives: '',
              benefits: '',
              maxVolunteers: eventToEdit.maxVolunteers.toString(),
              location: eventToEdit.location,
              address: '',
              city: '',
              state: ''
            });
          }
        } catch (error) {
          console.error('Error fetching event details:', error);
          toast.error('Erro ao carregar detalhes do evento.');
        }
      }
    };
    fetchEventDetails();
  }, [eventToEdit]);

  const categories = [
    'Meio Ambiente',
    'Educação',
    'Saúde',
    'Cultura',
    'Esportes',
    'Social',
    'Animais',
    'Tecnologia'
  ];

  // =========================================================================
  // FUNÇÕES DEDICADAS DE VALIDAÇÃO PARA OS CAMPOS DE LISTA (Puras, calculadas via useMemo)
  // =========================================================================

  const validateRoles = useMemo(() => {
    const validRoles = roles.filter(role => role.trim() !== '');
    if (roles.length === 0) return "Adicione pelo menos uma função para o evento.";
    if (roles.length > validRoles.length) {
      return "Remova funções vazias ou preencha-as.";
    }
    return '';
  }, [roles]);

  const validateResponsibilities = useMemo(() => {
    const validResponsibilities = responsibilities.filter(resp => resp.trim() !== '');
    if (responsibilities.length === 0) return "Adicione pelo menos uma atribuição para o evento.";
    if (responsibilities.length > validResponsibilities.length) {
      return "Remova atribuições vazias ou preencha-as.";
    }
    return '';
  }, [responsibilities]);

  const validateSchedules = useMemo(() => {
    if (schedules.length === 0) return "Adicione pelo menos um horário de trabalho.";
    const hasIncompleteSchedule = schedules.some(s => !s.date || !s.startTime || !s.endTime);
    if (hasIncompleteSchedule) {
      return "Todos os campos de Data, Início e Término em cada horário são obrigatórios.";
    }
    return '';
  }, [schedules]);

  // Efeito para atualizar os erros de lista no estado 'errors' APÓS a primeira submissão
  // Este efeito é ativado por isSubmitted e mantém a validação em tempo real depois do primeiro erro.
  useEffect(() => {
    if (!isSubmitted) return; // SÓ ATIVA A VALIDAÇÃO EM TEMPO REAL DE LISTAS APÓS O PRIMEIRO SUBMIT

    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };

      // Remove erros antigos de lista se eles foram corrigidos
      if (!validateRoles) delete newErrors.roles;
      if (!validateResponsibilities) delete newErrors.responsibilities;
      if (!validateSchedules) delete newErrors.schedules;

      // Adiciona novos erros de lista se existirem
      if (validateRoles) newErrors.roles = validateRoles;
      if (validateResponsibilities) newErrors.responsibilities = validateResponsibilities;
      if (validateSchedules) newErrors.schedules = validateSchedules;

      return newErrors;
    });
  }, [isSubmitted, validateRoles, validateResponsibilities, validateSchedules]);

  // =========================================================================
  // VALIDAÇÃO PRINCIPAL (Chamada no handleSubmit)
  // =========================================================================

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { title, category, description, objectives, benefits, maxVolunteers, location, address, city, state } = formData;

    // Validação dos campos simples
    if (title.length < 5) {
      newErrors.title = "O título é obrigatório e deve ter no mínimo 5 caracteres.";
    }
    if (!category) {
      newErrors.category = "Selecione uma categoria para o evento.";
    }
    const maxVol = parseInt(maxVolunteers);
    if (isNaN(maxVol) || maxVol <= 0) {
      newErrors.maxVolunteers = "O número de voluntários deve ser maior que zero (mínimo 1).";
    }
    if (description.length < 20) {
      newErrors.description = `A descrição é obrigatória e deve ter no mínimo 20 caracteres (atual: ${description.length}).`;
    }
    if (objectives.length < 10) {
      newErrors.objectives = `Os objetivos são obrigatórios e devem ter no mínimo 10 caracteres (atual: ${objectives.length}).`;
    }
    if (benefits.length < 10) {
      newErrors.benefits = `Os benefícios são obrigatórios e devem ter no mínimo 10 caracteres (atual: ${benefits.length}).`;
    }
    if (location.length < 3) {
      newErrors.location = "O nome do local é obrigatório e deve ter no mínimo 3 caracteres.";
    }
    if (address.length < 10) {
      newErrors.address = "O endereço é obrigatório e deve ter no mínimo 10 caracteres.";
    }
    if (city.length < 3) {
      newErrors.city = "A cidade é obrigatória e deve ter no mínimo 3 caracteres.";
    }
    if (state.length !== 2) {
      newErrors.state = "O estado é obrigatório e deve ter 2 caracteres (UF).";
    }

    // Adiciona os erros das listas (usando os memos)
    if (validateRoles) newErrors.roles = validateRoles;
    if (validateResponsibilities) newErrors.responsibilities = validateResponsibilities;
    if (validateSchedules) newErrors.schedules = validateSchedules;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validação instantânea para campos simples
    let validationMessage = '';

    switch (name) {
      case 'title':
        if (value.length > 0 && value.length < 5) validationMessage = "O título deve ter no mínimo 5 caracteres.";
        break;
      case 'category':
        if (!value) validationMessage = "Selecione uma categoria para o evento.";
        break;
      case 'maxVolunteers':
        const maxVol = parseInt(value);
        if (isNaN(maxVol) || maxVol <= 0) validationMessage = "O número de voluntários deve ser maior que zero (mínimo 1).";
        break;
      case 'description':
        if (value.length > 0 && value.length < 20) validationMessage = `A descrição deve ter no mínimo 20 caracteres (atual: ${value.length}).`;
        break;
      case 'objectives':
        if (value.length > 0 && value.length < 10) validationMessage = `Os objetivos devem ter no mínimo 10 caracteres (atual: ${value.length}).`;
        break;
      case 'benefits':
        if (value.length > 0 && value.length < 10) validationMessage = `Os benefícios devem ter no mínimo 10 caracteres (atual: ${value.length}).`;
        break;
      case 'location':
        if (value.length > 0 && value.length < 3) validationMessage = "O nome do local deve ter no mínimo 3 caracteres.";
        break;
      case 'address':
        if (value.length > 0 && value.length < 10) validationMessage = "O endereço deve ter no mínimo 10 caracteres.";
        break;
      case 'city':
        if (value.length > 0 && value.length < 3) validationMessage = "A cidade deve ter no mínimo 3 caracteres.";
        break;
      case 'state':
        if (value.length > 0 && value.length !== 2) validationMessage = "O estado deve ter 2 caracteres (UF).";
        break;
      default:
        break;
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: validationMessage,
    }));

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Funções de manipulação de listas (Não precisam de lógica extra, pois o useMemo e useEffect tratam a validação)
  const addRole = () => setRoles([...roles, '']);

  const addAdvancedRole = () => setRolesWithDetails([
    ...rolesWithDetails,
    { name: '', responsibilities: [''], maxVolunteers: 1 }
  ]);

  const updateAdvancedRole = (index: number, field: keyof RoleDetails, value: any) => {
    const updated = [...rolesWithDetails];
    updated[index] = { ...updated[index], [field]: value };
    setRolesWithDetails(updated);
  };

  const removeAdvancedRole = (index: number) => {
    if (rolesWithDetails.length > 1) {
      setRolesWithDetails(rolesWithDetails.filter((_, i) => i !== index));
    }
  };

  const addRoleResponsibility = (roleIndex: number) => {
    const updated = [...rolesWithDetails];
    updated[roleIndex].responsibilities.push('');
    setRolesWithDetails(updated);
  };

  const updateRoleResponsibility = (roleIndex: number, respIndex: number, value: string) => {
    const updated = [...rolesWithDetails];
    updated[roleIndex].responsibilities[respIndex] = value;
    setRolesWithDetails(updated);
  };

  const removeRoleResponsibility = (roleIndex: number, respIndex: number) => {
    const updated = [...rolesWithDetails];
    if (updated[roleIndex].responsibilities.length > 1) {
      updated[roleIndex].responsibilities = updated[roleIndex].responsibilities.filter((_, i) => i !== respIndex);
      setRolesWithDetails(updated);
    }
  };
  const updateRole = (index: number, value: string) => {
    const newRoles = [...roles];
    newRoles[index] = value;
    setRoles(newRoles);
  };
  const removeRole = (index: number) => {
    setRoles(roles.filter((_: string, i: number) => i !== index));
  };

  const addResponsibility = () => setResponsibilities([...responsibilities, '']);
  const updateResponsibility = (index: number, value: string) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities[index] = value;
    setResponsibilities(newResponsibilities);
  };
  const removeResponsibility = (index: number) => {
    setResponsibilities(responsibilities.filter((_: string, i: number) => i !== index));
  };

  const addSchedule = () => setSchedules([...schedules, { date: '', startTime: '', endTime: '' }]);
  const updateSchedule = (index: number, field: keyof WorkSchedule, value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };
  const removeSchedule = (index: number) => {
    setSchedules(schedules.filter((_: WorkSchedule, i: number) => i !== index));
  };
  // Fim das Funções de manipulação de listas

  // Image Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    } else {
      toast.error('Por favor, selecione apenas arquivos de imagem.');
    }
  };

  const handleImageSelect = (file: File) => {
    setImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelect(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true); // ATIVA O MODO DE VALIDAÇÃO

    if (validateForm()) {
      try {
        // Map form data to backend EventRequestDTO structure
        // Note: Backend currently does not support roles, responsibilities, objectives, benefits directly.
        // We will append them to description or ignore them for now.
        // Also, backend expects startDate and endDate, but frontend has multiple schedules.
        // We will use the first schedule for start/end date or min/max.

        let startDate = new Date().toISOString();
        let endDate = new Date().toISOString();

        if (schedules.length > 0) {
          const firstSchedule = schedules[0];
          if (firstSchedule.date && firstSchedule.startTime) {
            startDate = `${firstSchedule.date}T${firstSchedule.startTime}:00`;
          }
          if (firstSchedule.date && firstSchedule.endTime) {
            endDate = `${firstSchedule.date}T${firstSchedule.endTime}:00`;
          }
        }

        // Combine extra info into description for now
        let fullDescription = formData.description;
        if (formData.objectives) fullDescription += `\n\nObjetivos:\n${formData.objectives}`;
        if (formData.benefits) fullDescription += `\n\nBenefícios:\n${formData.benefits}`;
        if (roles.length > 0 && roles[0]) fullDescription += `\n\nFunções:\n${roles.join(', ')}`;

        // Construct the payload matching EventRequestDTO
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventPayload: any = {
          title: formData.title,
          description: fullDescription,
          startDate: startDate,
          endDate: endDate,
          coverImageUrl: '', // Image upload not supported in this endpoint
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: '00000-000', // Placeholder
            number: '0', // Placeholder
            neighborhood: '', // Placeholder
            complement: ''
          },
          volunteerSlots: parseInt(formData.maxVolunteers) || 0,
          filledSlots: 0,
          pointsReward: 10, // Default value
          organizationId: 1, // TODO: Get actual organization ID from context/auth
          tags: formData.category ? [{ code: formData.category.toLowerCase(), label: formData.category }] : []
        };

        if (eventToEdit) {
          await updateEvent(eventToEdit.id, eventPayload);
          toast.success('Evento atualizado com sucesso!');
        } else {
          await createEvent(eventPayload);
          toast.success('Evento criado com sucesso!');
        }
        onSuccess();
      } catch (error) {
        console.error('Error saving event', error);
        toast.error('Erro ao salvar evento. Tente novamente.');
      }
    } else {
      // Se houver erros, a função validateForm já atualizou o estado 'errors'
      console.error("Erros de validação:", errors);
    }
  };

  // Componente de Mensagem de Erro Reutilizável
  const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    message ? (
      <p className="mt-1 flex items-center text-sm font-medium text-red-600">
        <XCircle className="h-4 w-4 mr-1" />
        {message}
      </p>
    ) : null
  );

  const getBorderClass = (fieldName: string) =>
    errors[fieldName] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500';

  const activeErrors = Object.values(errors).filter(msg => msg) as string[]; // Filtra mensagens vazias
  const hasErrors = activeErrors.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 max-w-4xl mx-auto my-8">
      <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastrar Novo Evento</h2>
        <p className="text-gray-600">Preencha as informações do evento de voluntariado com atenção. Os campos marcados com * são obrigatórios.</p>

        {/* Sumário de Erros (Só aparece se houver erros, e agora filtra mensagens vazias) */}
        {hasErrors && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">Por favor, corrija os seguintes erros antes de prosseguir:</p>
            <ul className="list-disc list-inside mt-1 text-sm">
              {activeErrors.map((message: string, index: number) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Information */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-500" />
            Informações Básicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Título do Evento *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getBorderClass('title')}`}
                placeholder="Ex: Mutirão de Limpeza do Parque"
              />
              <ErrorMessage message={errors.title} />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getBorderClass('category')}`}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ErrorMessage message={errors.category} />
            </div>
            <div>
              <label htmlFor="maxVolunteers" className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Número Máximo de Voluntários *
              </label>
              <input
                id="maxVolunteers"
                type="number"
                name="maxVolunteers"
                value={formData.maxVolunteers}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getBorderClass('maxVolunteers')}`}
                placeholder="Ex: 50"
              />
              <ErrorMessage message={errors.maxVolunteers} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descrição do Evento *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getBorderClass('description')}`}
                placeholder="Descreva o evento, suas atividades e importância (mínimo 20 caracteres)..."
              />
              <ErrorMessage message={errors.description} />
            </div>
          </div>
        </section>

        {/* Image Upload Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <ImageIcon className="h-5 w-5 mr-2 text-green-500" />
            Imagem do Evento
            <span className="ml-2 text-xs text-gray-500 font-normal">(Upload temporariamente indisponível)</span>
          </h3>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
              }`}
          >
            {previewUrl ? (
              <div className="relative w-full max-w-md mx-auto">
                <div className="relative h-64 w-full rounded-lg overflow-hidden">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Arraste e solte uma imagem aqui</p>
                  <p className="text-sm text-gray-500">ou clique para selecionar</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Selecionar Arquivo
                </label>
              </div>
            )}
          </div>
        </section>

        {/* Objectives */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-500" />
            Objetivos do Evento *
          </h3>
          <textarea
            name="objectives"
            value={formData.objectives}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getBorderClass('objectives')}`}
            placeholder="Liste os principais objetivos que o evento busca alcançar (mínimo 10 caracteres)..."
          />
          <ErrorMessage message={errors.objectives} />
        </section>

        {/* Benefits */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Gift className="h-5 w-5 mr-2 text-green-500" />
            Benefícios para os Voluntários *
          </h3>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getBorderClass('benefits')}`}
            placeholder="Certificado, experiência, networking, alimentação, transporte, etc (mínimo 10 caracteres)..."
          />
          <ErrorMessage message={errors.benefits} />
        </section>

        {/* Role Management Toggle */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
              Gerenciamento de Funções
            </h3>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useAdvancedRoles}
                onChange={(e) => setUseAdvancedRoles(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">Modo Avançado</span>
            </label>
          </div>
          <p className="text-sm text-gray-600">
            {useAdvancedRoles
              ? 'Atribua responsabilidades e limite de voluntários específicos para cada função'
              : 'Modo simplificado: liste funções e responsabilidades gerais'}
          </p>
        </section>

        {!useAdvancedRoles ? (
          <>
            {/* Simple Roles */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-green-500" />
                Funções Disponíveis *
              </h3>
              <div className="space-y-3">
                {roles.map((role: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => updateRole(index, e.target.value)}
                      className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getBorderClass('roles')}`}
                      placeholder="Ex: Coordenador de equipe, Recepcionista, etc."
                    />
                    {roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRole(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
                <ErrorMessage message={errors.roles} />
                <button
                  type="button"
                  onClick={addRole}
                  className="text-green-600 hover:text-green-700 font-medium text-sm pt-2"
                >
                  + Adicionar Função
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Advanced Roles with Responsibilities */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-green-500" />
                Funções Detalhadas *
              </h3>
              <div className="space-y-6">
                {rolesWithDetails.map((role, roleIndex) => (
                  <div key={roleIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nome da Função *
                            </label>
                            <input
                              type="text"
                              value={role.name}
                              onChange={(e) => updateAdvancedRole(roleIndex, 'name', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ex: Coordenador de equipe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Máx. Voluntários *
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={role.maxVolunteers}
                              onChange={(e) => updateAdvancedRole(roleIndex, 'maxVolunteers', parseInt(e.target.value) || 1)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Responsabilidades *
                          </label>
                          <div className="space-y-2">
                            {role.responsibilities.map((resp, respIndex) => (
                              <div key={respIndex} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={resp}
                                  onChange={(e) => updateRoleResponsibility(roleIndex, respIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  placeholder="Ex: Auxiliar na organização do material"
                                />
                                {role.responsibilities.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeRoleResponsibility(roleIndex, respIndex)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addRoleResponsibility(roleIndex)}
                              className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                            >
                              + Adicionar Responsabilidade
                            </button>
                          </div>
                        </div>
                      </div>

                      {rolesWithDetails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAdvancedRole(roleIndex)}
                          className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAdvancedRole}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-green-600 hover:border-green-500 hover:bg-green-50 font-medium transition-colors"
                >
                  + Adicionar Nova Função
                </button>
              </div>
            </section>
          </>
        )}

        {/* Responsibilities */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <CheckSquare className="h-5 w-5 mr-2 text-green-500" />
            Atribuições e Responsabilidades *
          </h3>
          <div className="space-y-3">
            {responsibilities.map((resp: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => updateResponsibility(index, e.target.value)}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getBorderClass('responsibilities')}`}
                  placeholder="Ex: Auxiliar na organização do material"
                />
                {responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResponsibility(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    Remover
                  </button>
                )}
              </div>
            ))}
            <ErrorMessage message={errors.responsibilities} />
            <button
              type="button"
              onClick={addResponsibility}
              className="text-green-600 hover:text-green-700 font-medium text-sm pt-2"
            >
              + Adicionar Atribuição
            </button>
          </div>
        </section>

        {/* Work Schedules */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-500" />
            Horários de Trabalho *
          </h3>
          <div className="space-y-4">
            {schedules.map((schedule: WorkSchedule, index: number) => (
              <div key={index} className={`grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border rounded-lg ${errors.schedules ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={schedule.date}
                    onChange={(e) => updateSchedule(index, 'date', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${errors.schedules ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Início</label>
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) => updateSchedule(index, 'startTime', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${errors.schedules ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Término</label>
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) => updateSchedule(index, 'endTime', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${errors.schedules ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                <div className="flex items-end">
                  {schedules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className="w-full px-3 py-2 bg-white text-red-600 hover:bg-red-100 border border-gray-300 rounded-lg transition-colors text-sm shadow-sm"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            ))}
            <ErrorMessage message={errors.schedules} />
            <button
              type="button"
              onClick={addSchedule}
              className="text-green-600 hover:text-green-700 font-medium text-sm pt-2"
            >
              + Adicionar Horário
            </button>
          </div>
        </section>

        {/* Location */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-500" />
            Local do Evento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Nome do Local *</label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getBorderClass('location')}`}
                placeholder="Ex: Parque Ibirapuera (mínimo 3 caracteres)"
              />
              <ErrorMessage message={errors.location} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Endereço Completo *</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getBorderClass('address')}`}
                placeholder="Rua, número, bairro (mínimo 10 caracteres)"
              />
              <ErrorMessage message={errors.address} />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">Cidade *</label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${getBorderClass('city')}`}
                placeholder="Ex: São Paulo (mínimo 3 caracteres)"
              />
              <ErrorMessage message={errors.city} />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">Estado (UF) *</label>
              <input
                id="state"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                maxLength={2}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent uppercase ${getBorderClass('state')}`}
                placeholder="Ex: SP (2 caracteres)"
              />
              <ErrorMessage message={errors.state} />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-6 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-sm flex items-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            type="submit"
            className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center font-semibold shadow-md"
          >
            <Save className="h-4 w-4 mr-2" />
            Criar Evento
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            {previewUrl && (
              <div className="relative h-64 w-full">
                <Image src={previewUrl} alt={formData.title} fill className="object-cover" />
              </div>
            )}

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
                    {formData.category || 'Categoria'}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900">{formData.title || 'Título do Evento'}</h2>
                  <p className="text-gray-500 mt-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {formData.location || 'Local'}, {formData.city || 'Cidade'} - {formData.state || 'UF'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Sobre o Evento</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {formData.description || 'Descrição do evento...'}
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Objetivos</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {formData.objectives || 'Objetivos do evento...'}
                    </p>
                  </section>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      Datas e Horários
                    </h4>
                    <div className="space-y-3">
                      {schedules.map((schedule, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          <p className="font-medium text-gray-900">{schedule.date}</p>
                          <p>{schedule.startTime} - {schedule.endTime}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-primary" />
                      Vagas
                    </h4>
                    <div className="space-y-2">
                      {roles.map((role, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Fechar Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCreation;