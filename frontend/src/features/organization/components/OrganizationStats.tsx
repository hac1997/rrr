'use client';

import React, { useState } from 'react';
import { Calendar, Users, Award, TrendingUp, Clock, BarChart3, PieChart } from 'lucide-react';
import { MOCK_ORGANIZATION_CATEGORY_STATS, MOCK_ORGANIZATION_MONTHLY_DATA, MOCK_TOP_VOLUNTEERS } from '@/lib/services/orgData';
import { OrganizationStatsProps } from '@/lib/types';



const OrganizationStats: React.FC<OrganizationStatsProps> = ({ orgData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('year');

  // TODO: Fetch actual monthly data from backend when available
  const monthlyData = MOCK_ORGANIZATION_MONTHLY_DATA;
  // TODO: Fetch actual category stats from backend when available
  const categoryStats = MOCK_ORGANIZATION_CATEGORY_STATS;
  // TODO: Fetch actual top volunteers from backend when available
  const topVolunteers = MOCK_TOP_VOLUNTEERS;


  const maxVolunteers = Math.max(...monthlyData.map(d => d.volunteers));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Estatísticas da Organização</h2>
        <p className="text-gray-600">Acompanhe o desempenho e impacto dos seus eventos</p>
      </div>

      <div className="p-6">
        {/* Period Selector */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedPeriod === 'month'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Este Mês
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedPeriod === 'year'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Este Ano
          </button>
          <button
            onClick={() => setSelectedPeriod('custom')}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedPeriod === 'custom'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Período Personalizado
          </button>
        </div>

        {/* Custom Period Selector */}
        {selectedPeriod === 'custom' && (
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
            <Calendar className="h-10 w-10 text-blue-600 mb-3" />
            <p className="text-3xl font-bold text-gray-800 mb-1">{orgData.totalEvents}</p>
            <p className="text-sm text-gray-600">Total de Eventos</p>
            <p className="text-xs text-green-600 mt-2">+12% vs mês anterior</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
            <Users className="h-10 w-10 text-green-600 mb-3" />
            <p className="text-3xl font-bold text-gray-800 mb-1">{orgData.totalVolunteers}</p>
            <p className="text-sm text-gray-600">Voluntários Engajados</p>
            <p className="text-xs text-green-600 mt-2">+8% vs mês anterior</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-green-100 rounded-lg p-6">
            <Clock className="h-10 w-10 text-primary mb-3" />
            <p className="text-3xl font-bold text-gray-800 mb-1">{orgData.hoursGenerated}h</p>
            <p className="text-sm text-gray-600">Horas Geradas</p>
            <p className="text-xs text-green-600 mt-2">+15% vs mês anterior</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
            <Award className="h-10 w-10 text-orange-600 mb-3" />
            {/* TODO: Fetch actual certificates count from backend when available */}
            <p className="text-3xl font-bold text-gray-800 mb-1">258</p>
            <p className="text-sm text-gray-600">Certificados Emitidos</p>
            <p className="text-xs text-green-600 mt-2">+10% vs mês anterior</p>
          </div>
        </div>

        {/* Monthly Events Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
            Eventos Mensais - {new Date().getFullYear()}
          </h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-end justify-between h-64 space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end h-48 mb-2">
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t transition-all duration-300 hover:from-green-600 hover:to-green-400 relative group"
                      style={{ height: `${data.events > 0 ? (data.events / 6) * 100 : 0}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.events} eventos<br />{data.volunteers} voluntários<br />{data.hours}h
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{data.month}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Volunteers per Month Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-500" />
            Voluntários por Mês
          </h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-end justify-between h-64 space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end h-48 mb-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-400 relative group"
                      style={{ height: `${(data.volunteers / maxVolunteers) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.volunteers}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{data.month}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-green-500" />
            Distribuição por Categoria
          </h3>
          <div className="space-y-3">
            {categoryStats.map((stat, index) => (
              <div key={index} className="flex items-center">
                <div className="w-40 text-sm font-medium text-gray-700">{stat.category}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-24 text-right">
                  <span className="text-sm font-semibold text-gray-800">{stat.events} eventos</span>
                </div>
                <div className="w-24 text-right">
                  <span className="text-sm text-gray-600">{stat.volunteers} vol.</span>
                </div>
                <div className="w-12 text-right">
                  <span className="text-xs text-gray-500">{stat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Volunteers */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Top 5 Voluntários Mais Ativos
          </h3>
          <div className="space-y-3">
            {topVolunteers.map((volunteer, index) => (
              <div key={index} className="flex items-center p-4 bg-primary rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  #{volunteer.rank}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{volunteer.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>{volunteer.events} eventos</span>
                    <span>•</span>
                    <span>{volunteer.hours}h voluntariadas</span>
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors text-sm">
                  Ver Perfil
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationStats;
