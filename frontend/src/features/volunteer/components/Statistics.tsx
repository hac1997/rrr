'use client';

import React, { useState } from 'react';
import { TrendingUp, Calendar, Award, Users, Clock, Target, BarChart3 } from 'lucide-react';
import { UserStatsDTO } from '@/lib/types';
import { transformMonthlyActivities } from '@/lib/services/dashboard.service';

interface StatisticsProps {
  volunteerData: {
    totalEvents: number;
    hoursVolunteered: number;
    points: number;
  };
  dashboardData: UserStatsDTO;
}

const Statistics: React.FC<StatisticsProps> = ({ volunteerData, dashboardData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('year');

  const monthlyData = transformMonthlyActivities(dashboardData.atividadesMensais);
  const categoryStats = dashboardData.categoryStats;
  const achievements = dashboardData.achievements;

  const maxHours = Math.max(...monthlyData.map(d => d.hours));

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Estatísticas</h2>
        <p className="text-gray-600">Acompanhe seu impacto e desempenho como voluntário</p>
      </div>

      {/* Period Selector */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setSelectedPeriod('month')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedPeriod === 'month'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-200'
          }`}
        >
          Este Mês
        </button>
        <button
          onClick={() => setSelectedPeriod('year')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedPeriod === 'year'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-200'
          }`}
        >
          Este Ano
        </button>
        <button
          onClick={() => setSelectedPeriod('custom')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedPeriod === 'custom'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-200'
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">+12%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{volunteerData.totalEvents}</p>
          <p className="text-sm text-gray-600">Eventos Participados</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-8 w-8 text-green-600" />
            <span className="text-xs font-medium text-green-600">+8%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{volunteerData.hoursVolunteered}h</p>
          <p className="text-sm text-gray-600">Horas Voluntariadas</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Award className="h-8 w-8 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-600">+15%</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{volunteerData.points}</p>
          <p className="text-sm text-gray-600">Pontos Acumulados</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xs font-medium text-primary">#12</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">Top 5%</p>
          <p className="text-sm text-gray-600">Ranking Nacional</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
          Atividade Mensal - {new Date().getFullYear()}
        </h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-end justify-between h-64 space-x-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-48 mb-2">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-400 relative group"
                    style={{ height: `${(data.hours / maxHours) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {data.events} eventos<br/>{data.hours}h
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 font-medium">{data.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="mb-8 bg-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-500" />
          Eventos por Categoria
        </h3>
        <div className="space-y-3">
          {categoryStats.map((stat, index) => (
            <div key={index} className="flex items-center">
              <div className="w-32 text-sm font-medium text-gray-700">{stat.category}</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
              <div className="w-20 text-right">
                <span className="text-sm font-semibold text-gray-800">{stat.events} eventos</span>
              </div>
              <div className="w-12 text-right">
                <span className="text-xs text-gray-500">{stat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white p-3 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-blue-500" />
          Conquistas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;