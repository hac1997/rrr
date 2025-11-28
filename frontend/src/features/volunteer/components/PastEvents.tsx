'use client';

import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Award, Star, Search, CheckCircle } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/lib/services/getDataseService';
import type { PastEvent, UserStatsDTO } from '@/lib/types';

interface PastEventsProps {
  dashboardData: UserStatsDTO;
}

const PastEvents: React.FC<PastEventsProps> = ({ dashboardData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const pastEvents = useMemo(() => {
    return dashboardData.eventosPassados.map(event => ({
      id: event.id,
      title: event.titulo,
      organization: 'Organização',
      date: new Date(event.inicio).toLocaleDateString('pt-BR'),
      location: 'São Paulo, SP',
      hours: event.horasVoluntariadas,
      category: 'Voluntariado',
      rating: 5,
      certificateAvailable: true,
      description: event.titulo,
      role: 'Voluntário'
    } as PastEvent));
  }, [dashboardData]);

  const categories = EVENT_CATEGORIES;

  const filteredEvents = pastEvents
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date.split('/').reverse().join('-')).getTime() -
               new Date(a.date.split('/').reverse().join('-')).getTime();
      } else if (sortBy === 'hours') {
        return b.hours - a.hours;
      } else {
        return b.rating - a.rating;
      }
    });

  const totalHours = pastEvents.reduce((sum, event) => sum + event.hours, 0);
  const averageRating = (pastEvents.reduce((sum, event) => sum + event.rating, 0) / pastEvents.length).toFixed(1);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Eventos Passados</h2>
        <p className="text-gray-600">Histórico completo de suas participações em eventos de voluntariado</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <CheckCircle className="h-8 w-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{pastEvents.length}</p>
          <p className="text-sm text-gray-600">Eventos Completados</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <Clock className="h-8 w-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{totalHours}h</p>
          <p className="text-sm text-gray-600">Total de Horas</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
          <Star className="h-8 w-8 text-yellow-600 mb-2 fill-yellow-600" />
          <p className="text-2xl font-bold text-gray-800">{averageRating}</p>
          <p className="text-sm text-gray-600">Avaliação Média</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por evento ou organização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as categorias</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Mais recentes</option>
              <option value="hours">Mais horas</option>
              <option value="rating">Melhor avaliados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600 font-medium">{event.organization}</p>
              </div>
              <div className="flex-shrink-0">
                {renderStars(event.rating)}
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              <span className="font-semibold">Seu papel:</span> {event.role}
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="flex items-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {event.category}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                {event.date}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-green-500" />
                {event.location}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                {event.hours}h voluntariadas
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              {event.certificateAvailable && (
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center font-medium">
                  <Award className="h-4 w-4 mr-2" />
                  Ver Certificado
                </button>
              )}
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-600">Nenhum evento passado encontrado</p>
          <p className="text-gray-500 mt-2">Parece que você ainda não completou nenhum evento.</p>
        </div>
      )}
    </div>
  );
};

export default PastEvents;