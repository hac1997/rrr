import { ClosedEvent, EventParticipant, OpenEvent, OrganizationCategoryStats, OrganizationData, OrganizationMonthlyData, RecentOrganizationEvent, SearchVolunteer, TopVolunteer } from "../orgtypes";


export const MOCK_CLOSED_EVENTS: ClosedEvent[] = [
  {
    id: 1,
    title: 'Maratona Solidária 2024',
    category: 'Esportes',
    date: '15/08/2024',
    location: 'São Paulo, SP',
    participants: 50,
    attended: 48,
    hoursGenerated: 384,
    certificatesIssued: 48,
    averageScore: 95
  },
  {
    id: 2,
    title: 'Plantio de Árvores - Junho',
    category: 'Meio Ambiente',
    date: '10/06/2024',
    location: 'São Paulo, SP',
    participants: 35,
    attended: 32,
    hoursGenerated: 160,
    certificatesIssued: 32,
    averageScore: 92
  },
  {
    id: 3,
    title: 'Festival Cultural de Verão',
    category: 'Cultura',
    date: '22/01/2024',
    location: 'Rio de Janeiro, RJ',
    participants: 60,
    attended: 58,
    hoursGenerated: 580,
    certificatesIssued: 58,
    averageScore: 98
  },
  {
    id: 4,
    title: 'Campanha de Doação - Inverno',
    category: 'Social',
    date: '15/07/2024',
    location: 'São Paulo, SP',
    participants: 40,
    attended: 38,
    hoursGenerated: 152,
    certificatesIssued: 38,
    averageScore: 88
  },
  {
    id: 5,
    title: 'Oficinas Educacionais',
    category: 'Educação',
    date: '30/05/2024',
    location: 'Belo Horizonte, MG',
    participants: 25,
    attended: 24,
    hoursGenerated: 120,
    certificatesIssued: 24,
    averageScore: 94
  }
];

export const EVENT_CATEGORIES = ['Todas', 'Meio Ambiente', 'Educação', 'Saúde', 'Cultura', 'Esportes', 'Social'];


export const MOCK_EVENT_PARTICIPANTS: EventParticipant[] = [
  {
    id: 1,
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    role: 'Coordenadora',
    hoursWorked: 8,
    attended: true,
    score: 100,
    issueCertificate: true,
    notes: ''
  },
  {
    id: 2,
    name: 'João Santos',
    email: 'joao.santos@email.com',
    role: 'Voluntário Geral',
    hoursWorked: 8,
    attended: true,
    score: 100,
    issueCertificate: true,
    notes: ''
  },
  {
    id: 3,
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    role: 'Apoio Logístico',
    hoursWorked: 6,
    attended: true,
    score: 80,
    issueCertificate: true,
    notes: ''
  },
  {
    id: 4,
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    role: 'Voluntário Geral',
    hoursWorked: 0,
    attended: false,
    score: 0,
    issueCertificate: false,
    notes: 'Não compareceu'
  }
];

export const MOCK_SEARCH_VOLUNTEERS: SearchVolunteer[] = [
  {
    id: 1,
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    location: 'São Paulo, SP',
    totalEvents: 24,
    hoursVolunteered: 156,
    rating: 5,
    categories: ['Meio Ambiente', 'Social'],
    availability: 'Fins de semana',
    status: 'available'
  },
  {
    id: 2,
    name: 'João Santos',
    email: 'joao.santos@email.com',
    location: 'São Paulo, SP',
    totalEvents: 18,
    hoursVolunteered: 120,
    rating: 5,
    categories: ['Educação', 'Social'],
    availability: 'Flexível',
    status: 'available'
  },
  {
    id: 3,
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    location: 'Rio de Janeiro, RJ',
    totalEvents: 32,
    hoursVolunteered: 200,
    rating: 4,
    categories: ['Meio Ambiente', 'Cultura'],
    availability: 'Tardes e fins de semana',
    status: 'available'
  },
  {
    id: 4,
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    location: 'São Paulo, SP',
    totalEvents: 15,
    hoursVolunteered: 95,
    rating: 5,
    categories: ['Esportes', 'Social'],
    availability: 'Fins de semana',
    status: 'invited'
  },
  {
    id: 5,
    name: 'Carla Mendes',
    email: 'carla.mendes@email.com',
    location: 'Belo Horizonte, MG',
    totalEvents: 28,
    hoursVolunteered: 180,
    rating: 5,
    categories: ['Saúde', 'Meio Ambiente'],
    availability: 'Flexível',
    status: 'available'
  }
];

export const MOCK_OPEN_EVENTS: OpenEvent[] = [
  {
    id: 1,
    title: 'Limpeza da Praia de Copacabana',
    category: 'Meio Ambiente',
    date: '15/11/2025',
    location: 'Rio de Janeiro, RJ',
    volunteers: 45,
    maxVolunteers: 60,
    status: 'Inscrições Abertas'
  },
  {
    id: 2,
    title: 'Doação de Alimentos',
    category: 'Social',
    date: '18/11/2025',
    location: 'São Paulo, SP',
    volunteers: 32,
    maxVolunteers: 50,
    status: 'Inscrições Abertas'
  },
  {
    id: 3,
    title: 'Plantio de Árvores - Serra da Cantareira',
    category: 'Meio Ambiente',
    date: '20/11/2025',
    location: 'São Paulo, SP',
    volunteers: 28,
    maxVolunteers: 40,
    status: 'Inscrições Abertas'
  },
  {
    id: 4,
    title: 'Aulas de Reforço Escolar',
    category: 'Educação',
    date: '22/11/2025',
    location: 'São Paulo, SP',
    volunteers: 15,
    maxVolunteers: 20,
    status: 'Inscrições Abertas'
  },
  {
    id: 5,
    title: 'Festival Cultural Comunitário',
    category: 'Cultura',
    date: '25/11/2025',
    location: 'Belo Horizonte, MG',
    volunteers: 38,
    maxVolunteers: 50,
    status: 'Inscrições Abertas'
  }
];

export const MOCK_RECENT_ORGANIZATION_EVENTS: RecentOrganizationEvent[] = [
  { id: 1, name: 'Limpeza de Praia', volunteers: 45, date: '15/11/2025', status: 'Aberto' },
  { id: 2, name: 'Doação de Alimentos', volunteers: 32, date: '18/11/2025', status: 'Aberto' },
  { id: 3, name: 'Plantio de Árvores', volunteers: 28, date: '20/11/2025', status: 'Aberto' }
];

export const MOCK_ORGANIZATION_DATA: OrganizationData = {
  name: 'Instituto Ação Social',
  totalEvents: 45,
  activeEvents: 8,
  totalVolunteers: 342,
  hoursGenerated: 2840
};

export const MOCK_ORGANIZATION_MONTHLY_DATA: OrganizationMonthlyData[] = [
  { month: 'Jan', events: 3, volunteers: 45, hours: 180 },
  { month: 'Fev', events: 2, volunteers: 30, hours: 120 },
  { month: 'Mar', events: 4, volunteers: 60, hours: 240 },
  { month: 'Abr', events: 3, volunteers: 48, hours: 192 },
  { month: 'Mai', events: 5, volunteers: 75, hours: 300 },
  { month: 'Jun', events: 4, volunteers: 64, hours: 256 },
  { month: 'Jul', events: 6, volunteers: 90, hours: 360 },
  { month: 'Ago', events: 4, volunteers: 64, hours: 256 },
  { month: 'Set', events: 5, volunteers: 80, hours: 320 },
  { month: 'Out', events: 5, volunteers: 85, hours: 340 },
  { month: 'Nov', events: 4, volunteers: 70, hours: 280 },
  { month: 'Dez', events: 0, volunteers: 0, hours: 0 }
];

export const MOCK_ORGANIZATION_CATEGORY_STATS: OrganizationCategoryStats[] = [
  { category: 'Meio Ambiente', events: 12, volunteers: 180, percentage: 27 },
  { category: 'Social', events: 10, volunteers: 150, percentage: 22 },
  { category: 'Educação', events: 8, volunteers: 120, percentage: 18 },
  { category: 'Cultura', events: 7, volunteers: 105, percentage: 16 },
  { category: 'Saúde', events: 5, volunteers: 75, percentage: 11 },
  { category: 'Esportes', events: 3, volunteers: 45, percentage: 6 }
];


export const MOCK_TOP_VOLUNTEERS: TopVolunteer[] = [
  { name: 'Maria Silva', events: 24, hours: 156, rank: 1 },
  { name: 'João Santos', events: 18, hours: 120, rank: 2 },
  { name: 'Ana Costa', events: 32, hours: 200, rank: 3 },
  { name: 'Pedro Oliveira', events: 15, hours: 95, rank: 4 },
  { name: 'Carla Mendes', events: 28, hours: 180, rank: 5 }
];
