//ENTIDADES->do back end,


export interface OrganizationData {
  name: string;
  totalEvents: number;
  activeEvents: number;
  totalVolunteers: number;
  hoursGenerated: number;
}

export interface TopVolunteer {
  name: string;
  events: number;
  hours: number;
  rank: number;
}


export interface OrganizationCategoryStats {
  category: string;
  events: number;
  volunteers: number;
  percentage: number;
}

export interface OpenEvent {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  volunteers: number;
  maxVolunteers: number;
  status: string;
}

export interface ClosedEvent {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  participants: number;
  attended: number;
  hoursGenerated: number;
  certificatesIssued: number;
  averageScore: number;
}

export interface RecentOrganizationEvent {
  id: number;
  name: string;
  volunteers: number;
  date: string;
  status: string;
}


export interface EventParticipant {
  id: number;
  name: string;
  email: string;
  role: string;
  hoursWorked: number;
  attended: boolean;
  score: number;
  issueCertificate: boolean;
  notes: string;
}

export interface SearchVolunteer {
  id: number;
  name: string;
  email: string;
  location: string;
  totalEvents: number;
  hoursVolunteered: number;
  rating: number;
  categories: string[];
  availability: string;
  status: 'available' | 'invited' | 'confirmed';
}


export interface OrganizationMonthlyData {
  month: string;
  events: number;
  volunteers: number;
  hours: number;
}

