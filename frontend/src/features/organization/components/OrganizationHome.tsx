'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, TrendingUp, LogOut, Settings,
  Plus, Search, XCircle, Clock, Target
} from 'lucide-react';
import EventCreation from './EventCreation';
import OpenEvents from './OpenEvents';
import ClosedEvents from './ClosedEvents';
import OrganizationStats from './OrganizationStats';
import { MOCK_ORGANIZATION_DATA, MOCK_RECENT_ORGANIZATION_EVENTS } from '@/lib/services/orgData';
import { OrganizationProfile, OrgData, OrgEventSummary } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { getOrganizationById } from '@/lib/services/organization.service';

type ViewType = 'dashboard' | 'create-event' | 'open-events' | 'closed-events' | 'statistics' | 'settings';

interface OrganizationHomeProps {
  onLogout: () => void;
}

const OrganizationHome: React.FC<OrganizationHomeProps> = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [orgProfile, setOrgProfile] = useState<OrganizationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<OrgEventSummary | null>(null);

  const fetchOrgData = async () => {
    if (user?.id) {
      try {
        const data = await getOrganizationById(user.id.toString());
        if (data) setOrgProfile(data);
      } catch (error) {
        console.error('Error fetching organization data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const orgData: OrgData | null = orgProfile ? {
    name: orgProfile.name,
    totalEvents: orgProfile.stats.totalEvents,
    activeEvents: orgProfile.stats.activeEvents,
    totalVolunteers: orgProfile.stats.totalVolunteers,
    hoursGenerated: orgProfile.stats.hoursGenerated
  } : null;

  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Painel Inicial', icon: Target },
    { id: 'create-event' as ViewType, label: 'Cadastrar Evento', icon: Plus },
    { id: 'open-events' as ViewType, label: 'Meus Eventos', icon: Calendar },
    { id: 'closed-events' as ViewType, label: 'Eventos Encerrados', icon: XCircle },
    { id: 'statistics' as ViewType, label: 'Estatísticas', icon: TrendingUp },
    { id: 'settings' as ViewType, label: 'Configurações', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50" role="status" aria-live="polite">
        <div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" aria-hidden="true"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50" role="alert">
        <div className="text-center p-4">
          <h1 className="text-xl font-bold text-gray-800 mb-2">Organização não encontrada</h1>
          <p className="text-gray-600 mb-4">Não foi possível carregar os dados da organização.</p>
          <button onClick={handleLogout} className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all">Sair</button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview orgData={orgData} onNavigate={setCurrentView} recentEvents={orgProfile?.upcomingEvents || []} />;
      case 'create-event':
        return (
          <EventCreation
            onSuccess={() => {
              setEditingEvent(null);
              fetchOrgData(); // Call fetchOrgData on success
              setCurrentView('open-events');
            }}
            eventToEdit={editingEvent}
          />
        );
      case 'open-events':
        return (
          <OpenEvents
            events={orgProfile?.upcomingEvents || []}
            onEdit={(event) => {
              setEditingEvent(event);
              setCurrentView('create-event');
            }}
            onUpdate={fetchOrgData} // Pass fetchOrgData as onUpdate prop
          />
        );
      case 'closed-events':
        return <ClosedEvents events={orgProfile?.historicalEvents || []} organizationName={orgData.name} />;
      case 'statistics':
        return <OrganizationStats orgData={orgData} />;
      case 'settings':
        return <OrganizationSettings />;
      default:
        return <DashboardOverview orgData={orgData} onNavigate={setCurrentView} recentEvents={orgProfile?.upcomingEvents || []} />;
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        aria-label="Abrir menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 min-h-screen bg-white shadow-xl border-r-2 border-gray-200`} role="navigation" aria-label="Menu principal">
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800"
            aria-label="Fechar menu"
          >
            <XCircle className="h-6 w-6" />
          </button>

          <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-br from-orange-50 to-green-50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0" aria-hidden="true">
                {orgData.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-gray-800 text-lg truncate">{orgData.name}</h2>
                <p className="text-xs text-gray-600 font-medium">Organização</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-md">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white font-medium">Eventos Ativos</span>
                <span className="font-bold text-white text-2xl">{orgData.activeEvents}</span>
              </div>
            </div>
          </div>

          <nav className="p-4" aria-label="Navegação da organização">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mb-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${currentView === item.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'hover:bg-orange-50 text-sidebar-hover'
                    }`}
                  aria-current={currentView === item.id ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 w-64 p-4 border-t-2 border-gray-200 bg-white">
            <button
              onClick={() => {
                onLogout();
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Sair da conta"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-16 lg:pt-8" role="main">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC<{ orgData: OrgData; onNavigate: (view: ViewType) => void; recentEvents: OrgEventSummary[] }> = ({ orgData, onNavigate, recentEvents }) => {
  return (
    <div>
      <div className="mb-8 bg-gradient-to-r from-orange-100 to-green-100 rounded-2xl p-6 border-l-4 border-primary">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Bem-vindo, {orgData.name}! 👋</h2>
        <p className="text-gray-700 text-lg">Gerencie seus eventos e acompanhe o impacto social da sua organização</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-6 border-2 border-orange-200 hover:border-primary transition-all hover:shadow-2xl hover:scale-105 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div className="bg-white px-3 py-1 rounded-full">
              <span className="text-xs font-bold text-primary">+12%</span>
            </div>
          </div>
          <p className="text-5xl font-black text-gray-800 mb-2">{orgData.totalEvents}</p>
          <p className="text-sm text-gray-700 font-semibold">Total de Eventos</p>
          <div className="mt-3 h-1 bg-primary rounded-full w-3/4"></div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:border-aux-1 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-aux-1 p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div className="bg-white px-3 py-1 rounded-full">
              <span className="text-xs font-bold text-aux-1">ATIVO</span>
            </div>
          </div>
          <p className="text-5xl font-black text-gray-800 mb-2">{orgData.activeEvents}</p>
          <p className="text-sm text-gray-700 font-semibold">Eventos Ativos</p>
          <div className="mt-3 h-1 bg-aux-1 rounded-full w-2/3"></div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 border-2 border-green-200 hover:border-secondary transition-all hover:shadow-2xl hover:scale-105 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-secondary p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md">
              <Users className="h-8 w-8 text-gray-800" />
            </div>
            <div className="bg-white px-3 py-1 rounded-full">
              <span className="text-xs font-bold text-green-600">+28</span>
            </div>
          </div>
          <p className="text-5xl font-black text-gray-800 mb-2">{orgData.totalVolunteers}</p>
          <p className="text-sm text-gray-700 font-semibold">Voluntários Totais</p>
          <div className="mt-3 h-1 bg-secondary rounded-full w-full"></div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-lg p-6 border-2 border-amber-200 hover:border-orange-400 transition-all hover:shadow-2xl hover:scale-105 cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-400 p-3 rounded-xl group-hover:scale-110 transition-transform shadow-md">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <div className="bg-white px-3 py-1 rounded-full">
              <span className="text-xs font-bold text-orange-600">+45h</span>
            </div>
          </div>
          <p className="text-5xl font-black text-gray-800 mb-2">{orgData.hoursGenerated}<span className="text-2xl">h</span></p>
          <p className="text-sm text-gray-700 font-semibold">Horas de Impacto</p>
          <div className="mt-3 h-1 bg-orange-400 rounded-full w-5/6"></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="bg-primary p-2 rounded-lg mr-3">
            <TrendingUp className="h-6 w-6 text-white" />
          </span>
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('create-event')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-primary hover:bg-orange-50 transition-all duration-200 text-center group"
          >
            <div className="bg-primary p-4 rounded-xl w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Plus className="h-10 w-10 text-white" />
            </div>
            <p className="font-bold text-gray-700 text-lg group-hover:text-primary">Criar Novo Evento</p>
          </button>
          <button
            onClick={() => onNavigate('statistics')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-aux-1 hover:bg-blue-50 transition-all duration-200 text-center group"
          >
            <div className="bg-aux-1 p-4 rounded-xl w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Search className="h-10 w-10 text-white" />
            </div>
            <p className="font-bold text-gray-700 text-lg group-hover:text-aux-1">Buscar Voluntários</p>
          </button>
          <button
            onClick={() => onNavigate('statistics')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-secondary hover:bg-green-50 transition-all duration-200 text-center group"
          >
            <div className="bg-secondary p-4 rounded-xl w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-10 w-10 text-gray-800" />
            </div>
            <p className="font-bold text-gray-700 text-lg group-hover:text-secondary">Ver Estatísticas</p>
          </button>
        </div>
      </div>

      {/* Recent Events */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg mr-3">
            <Calendar className="h-6 w-6 text-white" />
          </span>
          Eventos Recentes
        </h3>
        {recentEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhum evento recente.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map(event => (
              <div key={event.id} className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100 hover:shadow-2xl hover:border-primary transition-all hover:scale-105 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">{event.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      {event.date}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-secondary text-gray-800">
                    ✓
                  </span>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-secondary" />
                      <span className="font-bold text-gray-800">{event.volunteers}</span>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">voluntários</span>
                  </div>
                  <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                      style={{ width: `${(event.volunteers / (event.maxVolunteers || 50)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all group-hover:scale-105">
                  Ver Detalhes →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const OrganizationSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Configurações da Organização</h2>
      <p className="text-gray-600">Configurações em desenvolvimento...</p>
    </div>
  );
};

export default OrganizationHome;
