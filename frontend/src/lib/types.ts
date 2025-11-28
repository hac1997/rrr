import React from 'react';

export interface Event {
  id: number;
  name: string;
  date: string;
  description: string;
  isEmergency?: boolean;
  organizationId?: number;
}

export interface Volunteer {
  id: number;
  name: string;
  email: string;
  group: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  body: string;
  imageUrl: string;
  publishDate: string;
  newsType: 'Announcement' | 'Event' | 'Conquest';
  eventTags: string[];
}
// src/lib/types.ts
// Interfaces para os objetos aninhados
export interface Evento {
  id: number;
  titulo: string;
  inicio: string; // Ex: "2025-05-01T08:00:00"
  fim: string; // Ex: "2025-05-01T12:00:00"
  completed: boolean;
  pontos: number;
  horasVoluntariadas: number;
}

export interface Certificado {
  id: number;
  nomeEvento: string;
  organizacao: string;
  horasCertificadas: number;
  dataCertificacao: string; // Ex: "2024-08-15T00:00:00"
}

export interface CategoryStat {
  category: string;
  events: number;
  percentage: number;
}

export interface Achievement {
  title: string;
  description: string;
  date: string; // Ex: "16/11/2025"
  icon: string; // Ex: "images/nivel3.png"
}

export interface Notification {
  id: number;
  text: string;
  time: string; // Ex: "5d atrás"
}

export interface AtividadesMensais {
  eventos: number;
  horas: number;
}

// Interface principal do DTO
export interface UserStatsDTO {
  eventosPassados: Evento[];
  eventosCompletados: Evento[];
  avaliacaoMediaUsuario: number;
  eventoDetalhes: unknown | null;
  totalEventosParticipados: number;
  totalHorasVoluntariadas: number;
  pontosAcumulados: number;
  atividadesMensais: { [key: string]: AtividadesMensais };
  totalCertificados: number;
  totalHorasCertificadas: number;
  certificados: Certificado[];
  categoryStats: CategoryStat[];
  achievements: Achievement[];
  notifications: Notification[];
}

// Interface auxiliar para o StatCard e Props de Statistics (como estava no mock)
export interface VolunteerData {
  totalEvents: number;
  hoursVolunteered: number;
  points: number;
}
export interface Group {
  id: number;
  name: string;
  members: number;
}

export interface VolunteerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  totalEvents: number;
  hoursVolunteered: number;
  points: number;
}



export interface FeedItem {
  id: number;
  type: 'event' | 'news' | 'achievement';
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  category?: string;
  location?: string;
  eventDate?: string;
  image?: string;
  organizationId?: number;
  organizationDescription?: string;
  organizationMission?: string;
}

export interface Notification {
  id: number;
  text: string;
  time: string;
}

export interface MonthlyData {
  month: string;
  events: number;
  hours: number;
}

export interface CategoryStats {
  category: string;
  events: number;
  percentage: number;
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
  icon: string;
}

export interface Certificate {
  id: number;
  eventName: string;
  organization: string;
  date: string;
  hours: number;
  status: 'available' | 'pending' | 'processing';
  code: string;
}

export interface PastEvent {
  id: number;
  title: string;
  organization: string;
  date: string;
  location: string;
  hours: number;
  category: string;
  rating: number;
  certificateAvailable: boolean;
  description: string;
  role: string;
}







export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  label: string;
}

export interface ProfileSettingsProps {
  volunteerData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
};


export interface VolunteerSearchProps {
  event: {
    id: number;
    title: string;
  };
  onBack: () => void;
}

export interface OrganizationStatsProps {
  orgData: {
    totalEvents: number;
    activeEvents: number;
    totalVolunteers: number;
    hoursGenerated: number;
  };
}

export interface OrgData {
  name: string;
  totalEvents: number;
  activeEvents: number;
  totalVolunteers: number;
  hoursGenerated: number;
}


export interface SearchEvent {
  id: number;
  title: string;
  organization: string;
  date: string;
  location: string;
  category: string;
  volunteers: number;
  maxVolunteers: number;
  description: string;
}







// src/lib/types.ts

export type RegisterType = 'volunteer' | 'organization';

// Tipo base comum
interface BaseFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
  state: string;
  preferences: string[];
  termsAccepted: boolean;
  phone: string;
}

// Voluntário
export interface VolunteerFormData extends BaseFormData {
  birthDate: string;
  gender: string;
  cpf: string;
  cnpj?: never; // opcional, mas nunca usado
}

// Organização
export interface OrganizationFormData extends BaseFormData {
  cnpj: string;
  gender?: never;
  birthDate?: never;
  cpf?: never;
}

// Tipo genérico para steps
export interface RegisterStepProps {
  formData: RegisterFormData | VolunteerFormData | OrganizationFormData;
  isStepValid: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  emailError?: string;
  onTagToggle?: (tagId: string) => void;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
  state: string;
  birthDate: string;
  phone: string;
  gender: string;
  preferences: string[];
  termsAccepted: boolean;
  cnpj: string;
  cpf: string;
}

export interface OrganizationProfile {
  id: number;
  name: string;
  description: string;
  mission: string;
  logoUrl: string;
  bannerUrl?: string;
  website?: string;
  email: string;
  phone: string;
  address: Address;
  stats: {
    totalEvents: number;
    activeEvents: number;
    totalVolunteers: number;
    hoursGenerated: number;
  };
  upcomingEvents: OrgEventSummary[];
  historicalEvents: OrgEventSummary[];
}

export interface OrgEventSummary {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  rating?: number;
  hours: number;
  category?: string;
  volunteers: number;
  maxVolunteers: number;
}
