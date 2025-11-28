'use client';

// 1. Imports atualizados (useCallback e ícones)
import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Calendar, Award, TrendingUp, Settings, Clock, Heart
} from 'lucide-react';
import EventFeed from './EventFeed';
import ProfileSettings from './ProfileSettings';
import Statistics from './Statistics';
import Certificates from './Certificates';
import PastEvents from './PastEvents';
import EventSearch from './EventSearch';
// 2. Erro de sintaxe da importação anterior corrigido
import { Sidebar } from '@/components/layout/Sidebar'; 
import { StatCard } from '@/components/charts/StatCard';
import { useAuth } from '@/lib/hooks/useAuth';
import { 
  VolunteerData, 
  UserStatsDTO
} from '@/lib/types';
import { getUserDashboard } from '@/actions/dashboard';

type ViewType = 'feed' | 'search' | 'profile' | 'statistics' | 'certificates' | 'past-events';

const VolunteerHome: React.FC = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('feed');
  const [volunteerData, setVolunteerData] = useState<VolunteerData | null>(null);
  const [dashboardData, setDashboardData] = useState<UserStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const loadVolunteerData = useCallback(async () => {
    // ... (lógica de loadVolunteerData permanece a mesma)
    if (!user) return;
    try {
      setLoading(true);
      const dashboard = await getUserDashboard(user.id);
      setDashboardData(dashboard);
      
      setVolunteerData({
        name: user.email, 
        email: user.email,
        points: dashboard.pontosAcumulados,
        totalEvents: dashboard.totalEventosParticipados,
        hoursVolunteered: dashboard.totalHorasVoluntariadas,
        phone: '', 
        address: '', 
      });
    } catch (error) {
      console.error('Erro ao carregar dados do voluntário:', error);
    } finally {
      setLoading(false);
    }
  }, [user]); 

  useEffect(() => {
    // ... (lógica de useEffect permanece a mesma)
    if (user && !authLoading) {
      loadVolunteerData();
    }
  }, [user, authLoading, loadVolunteerData]);

  // Render Guard (permanece o mesmo)
  if (authLoading || loading || !volunteerData || !dashboardData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Carregando...</p>
      </div>
    );
  }

  // 3. 'renderView' CORRIGIDO com as props exatas dos seus arquivos
  const renderView = () => {
    // ... (lógica de renderView permanece a mesma)
    switch (currentView) {
      case 'feed':
        return <EventFeed dashboardData={dashboardData} />;
      case 'search':
        return <EventSearch />;
      case 'profile':
        return <ProfileSettings volunteerData={volunteerData} />;
      case 'statistics':
        return <Statistics 
                  volunteerData={volunteerData} 
                  dashboardData={dashboardData} 
                />;
      case 'certificates':
        return <Certificates dashboardData={dashboardData} />;
      case 'past-events':
        return <PastEvents dashboardData={dashboardData} />;
      default:
        return <EventFeed dashboardData={dashboardData} />;
    }
  };

  // 4. DEFINIÇÃO DO MENU com base no seu Sidebar.tsx
  const menuItems = [
    { id: 'feed', label: 'Feed', icon: Heart },
    { id: 'search', label: 'Buscar Eventos', icon: Search },
    { id: 'statistics', label: 'Estatísticas', icon: TrendingUp },
    { id: 'certificates', label: 'Certificados', icon: Award },
    { id: 'past-events', label: 'Eventos Passados', icon: Calendar },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 5. Sidebar REATORADO para corresponder ao seu Sidebar.tsx */}
      <Sidebar
        userName={volunteerData.name}
        userRole="Voluntário" // O DTO não fornece isso, então usamos um valor fixo
        userInitial={volunteerData.name.charAt(0).toUpperCase()} // Calcula a inicial
        badgeLabel="Pontos"
        badgeValue={volunteerData.points}
        menuItems={menuItems} // Passa o array de menu
        currentView={currentView}
        // CORREÇÃO PARA O ERRO 1:
        // Passamos uma função que aceita 'string' e chama 'setCurrentView'
        onViewChange={(view) => setCurrentView(view as ViewType)}
        onLogout={logout}
        gradientFrom="from-blue-500"
        gradientTo="to-green-500"
      />
      {/* TODOS OS <Sidebar.Item>, <Sidebar.Separator>, <Sidebar.User> FORAM REMOVIDOS */}

      {/* Main Content (permanece o mesmo) */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats Bar (permanece o mesmo) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={Calendar}
              value={volunteerData.totalEvents}
              label="Eventos Participados"
              colorFrom="from-blue-50"
              colorTo="to-blue-100"
              iconColor="text-blue-500"
            />
            <StatCard
              icon={Clock}
              value={`${volunteerData.hoursVolunteered}h`}
              label="Horas Voluntariadas"
              colorFrom="from-green-50"
              colorTo="to-green-100"
              iconColor="text-secondary"
            />
            <StatCard
              icon={TrendingUp}
              value="#12" 
              label="Ranking"
              colorFrom="from-yellow-50"
              colorTo="to-yellow-100"
              iconColor="text-yellow-500"
            />
          </div>

          {/* Dynamic Content Area (permanece o mesmo) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {renderView()}
          </div>
        </div>
      </main>

       {/* Botão de Perfil/Configurações (permanece o mesmo) */}
       <div className="absolute top-8 right-8">
        <button 
          onClick={() => setCurrentView('profile')} 
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Configurações do Perfil"
        >
          <Settings size={24} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default VolunteerHome;