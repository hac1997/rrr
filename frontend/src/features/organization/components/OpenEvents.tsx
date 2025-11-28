'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Users, XCircle, Search as SearchIcon, Award, UserCheck, Edit, Filter, Clock } from 'lucide-react';
import VolunteerSearch from './VolunteerSearch';
import EventScoring from './EventScoring';
import VolunteerGroups from './VolunteerGroups';
import { MOCK_OPEN_EVENTS } from '@/lib/services/orgData';
import { OrgEventSummary } from '@/lib/types';
import { cancelEvent } from '@/lib/services/event.service';
import { toast } from 'sonner';

interface OpenEventsProps {
  events: OrgEventSummary[];
  onEdit?: (event: OrgEventSummary) => void;
  onUpdate?: () => void;
}

const OpenEvents: React.FC<OpenEventsProps> = ({ events, onEdit, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<OrgEventSummary | null>(null);
  const [showVolunteerSearch, setShowVolunteerSearch] = useState(false);
  const [showEventScoring, setShowEventScoring] = useState(false);
  const [showVolunteerGroups, setShowVolunteerGroups] = useState(false);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseEvent = (event: OrgEventSummary) => {
    setSelectedEvent(event);
    setShowEventScoring(true);
  };

  const handleSearchVolunteers = (event: OrgEventSummary) => {
    setSelectedEvent(event);
    setShowVolunteerSearch(true);
  };

  const handleManageGroups = (event: OrgEventSummary) => {
    setSelectedEvent(event);
    setShowVolunteerGroups(true);
  };

  const handleCancelEvent = async (event: OrgEventSummary) => {
    const userConfirmed = await new Promise<boolean>((resolve) => {
      toast(
        <div className="flex flex-col space-y-2">
          <p className="font-semibold">Tem certeza que deseja cancelar este evento?</p>
          <p className="text-sm text-gray-600">{event.title}</p>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => {
                resolve(true);
                toast.dismiss();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
            >
              Cancelar Evento
            </button>
            <button
              onClick={() => {
                resolve(false);
                toast.dismiss();
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm"
            >
              Voltar
            </button>
          </div>
        </div>,
        { duration: 10000 }
      );
    });

    if (userConfirmed) {
      try {
        await cancelEvent(event.id);
        toast.success('Evento cancelado com sucesso!');
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error cancelling event:', error);
        toast.error('Erro ao cancelar evento.');
      }
    }
  };

  if (showVolunteerSearch && selectedEvent) {
    return (
      <VolunteerSearch
        event={selectedEvent}
        onBack={() => {
          setShowVolunteerSearch(false);
          setSelectedEvent(null);
        }}
      />
    );
  }

  if (showEventScoring && selectedEvent) {
    return (
      <EventScoring
        event={selectedEvent}
        onBack={() => {
          setShowEventScoring(false);
          setSelectedEvent(null);
          if (onUpdate) onUpdate();
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Meus Eventos</h2>
              <p className="text-gray-500">Gerencie seus eventos ativos e acompanhe as inscrições</p>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                            event.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {event.status === 'OPEN' ? 'Inscrições Abertas' : event.status}
                          </span>
                          <span className="text-gray-400 text-sm">•</span>
                          <span className="text-gray-500 text-sm">Criado em {event.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                        <div className="flex items-center text-gray-500 text-sm space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.date}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {event.hours}h
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit && onEdit(event)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar Evento"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center text-sm font-medium text-gray-700">
                          <Users className="h-4 w-4 mr-2 text-blue-500" />
                          Voluntários Inscritos
                        </div>
                        <span className="text-sm text-gray-500">
                          <span className="font-bold text-gray-900">{event.volunteers}</span> / {event.maxVolunteers} vagas
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(event.volunteers / event.maxVolunteers) * 100}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleCancelEvent(event)}
                          className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center text-sm font-medium"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSearchVolunteers(event)}
                          className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center text-sm font-medium"
                        >
                          <SearchIcon className="h-4 w-4 mr-2" />
                          Buscar Voluntários
                        </button>
                        <button
                          onClick={() => handleManageGroups(event)}
                          className="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center text-sm font-medium"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Gerenciar Grupos
                        </button>
                        <button
                          onClick={() => handleCloseEvent(event)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200 flex items-center text-sm font-medium"
                        >
                          <Award className="h-4 w-4 mr-2" />
                          Encerrar e Pontuar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <Calendar className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum evento encontrado</h3>
                <p className="mt-1 text-gray-500">Tente ajustar seus filtros ou crie um novo evento.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Volunteer Groups Modal */}
      {showVolunteerGroups && selectedEvent && (
        <VolunteerGroups
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          availableVolunteers={Array.from({ length: selectedEvent.volunteers }, (_, i) => ({
            id: i + 1,
            name: `Voluntário ${i + 1}`,
            email: `voluntario${i + 1}@example.com`,
            role: 'Voluntário'
          }))}
          onClose={() => setShowVolunteerGroups(false)}
        />
      )}
    </div>
  );
};

export default OpenEvents;
