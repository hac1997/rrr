'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Users, Award, Search, Eye, Download, TrendingUp, CheckCircle, XCircle, FileText } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/lib/services/orgData';
import { OrgEventSummary } from '@/lib/types';
import { toast } from 'sonner';
import { generateEventReport, generateVolunteerSummaryReport } from '@/lib/utils/pdf-generator';

interface ClosedEventsProps {
  events: OrgEventSummary[];
  organizationName?: string;
}

interface VolunteerCertificate {
  id: number;
  volunteerName: string;
  email: string;
  hours: number;
  status: 'issued' | 'pending';
  issueDate?: string;
  certificateCode?: string;
}

const ClosedEvents: React.FC<ClosedEventsProps> = ({ events, organizationName = 'Organização' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<OrgEventSummary | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCertificatesModal, setShowCertificatesModal] = useState(false);
  const [certificatesForEvent, setCertificatesForEvent] = useState<VolunteerCertificate[]>([]);

  const categories = EVENT_CATEGORIES;

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Derived stats
  const totalParticipants = events.reduce((sum, e) => sum + e.volunteers, 0);
  const totalHours = events.reduce((sum, e) => sum + (e.volunteers * e.hours), 0);
  const totalCertificates = events.reduce((sum, e) => sum + e.volunteers, 0); // Assuming all attended get certs

  const handleViewDetails = (event: OrgEventSummary) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleDownloadReport = (event: OrgEventSummary) => {
    try {
      const mockVolunteers = Array.from({ length: event.volunteers }, (_, i) => ({
        name: `Voluntário ${i + 1}`,
        email: `voluntario${i + 1}@example.com`,
        hours: event.hours,
        role: 'Voluntário Geral',
        status: 'Presente' as const
      }));

      generateEventReport(event, organizationName, mockVolunteers);
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    }
  };

  const handleDownloadAllReports = () => {
    try {
      generateVolunteerSummaryReport(events, organizationName);
      toast.success('Relatório geral gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório geral:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    }
  };

  const handleViewCertificates = (event: OrgEventSummary) => {
    // Mock certificate data - in production, fetch from backend
    const mockCertificates: VolunteerCertificate[] = Array.from({ length: event.volunteers }, (_, i) => ({
      id: i + 1,
      volunteerName: `Voluntário ${i + 1}`,
      email: `voluntario${i + 1}@example.com`,
      hours: event.hours,
      status: Math.random() > 0.2 ? 'issued' : 'pending',
      issueDate: Math.random() > 0.2 ? event.date : undefined,
      certificateCode: Math.random() > 0.2 ? `CERT-${event.id}-${i + 1}` : undefined
    }));

    setCertificatesForEvent(mockCertificates);
    setSelectedEvent(event);
    setShowCertificatesModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Eventos Encerrados</h2>
            <p className="text-gray-600">Histórico completo de eventos realizados pela organização</p>
          </div>
          <button
            onClick={handleDownloadAllReports}
            disabled={events.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="h-5 w-5 mr-2" />
            Baixar Relatório Geral
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <Calendar className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{events.length}</p>
            <p className="text-sm text-gray-600">Eventos Realizados</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <Users className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{totalParticipants}</p>
            <p className="text-sm text-gray-600">Participantes Totais</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-green-100 rounded-lg p-4">
            <Award className="h-8 w-8 text-primary mb-2" />
            <p className="text-2xl font-bold text-gray-800">{totalCertificates}</p>
            <p className="text-sm text-gray-600">Certificados Emitidos</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{totalHours}h</p>
            <p className="text-sm text-gray-600">Horas Geradas</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar eventos encerrados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todas as categorias</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
          </p>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map(event => {
            const attendanceRate = event.maxVolunteers > 0 ? ((event.volunteers / event.maxVolunteers) * 100).toFixed(0) : '0';
            const hoursGenerated = event.volunteers * event.hours;

            return (
              <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {event.category || 'Geral'}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Concluído
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-green-500" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        {event.volunteers}/{event.maxVolunteers} presentes
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Taxa de Ocupação</p>
                        <p className="text-lg font-bold text-gray-800">{attendanceRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Horas Geradas</p>
                        <p className="text-lg font-bold text-gray-800">{hoursGenerated}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Certificados</p>
                        <p className="text-lg font-bold text-gray-800">{event.volunteers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Avaliação Média</p>
                        <p className="text-lg font-bold text-gray-800">{event.rating || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetails(event)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </button>
                  <button
                    onClick={() => handleDownloadReport(event)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Relatório
                  </button>
                  <button
                    onClick={() => handleViewCertificates(event)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center font-medium"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Ver Certificados
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum evento encontrado com os filtros selecionados</p>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Detalhes do Evento</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Event Header */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-3xl font-bold text-gray-900">{selectedEvent.title}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Concluído
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    {selectedEvent.date}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-500" />
                    {selectedEvent.location}
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <Users className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{selectedEvent.volunteers}</p>
                  <p className="text-sm text-gray-600">Participantes</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{selectedEvent.volunteers * selectedEvent.hours}h</p>
                  <p className="text-sm text-gray-600">Horas Geradas</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <Award className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{selectedEvent.volunteers}</p>
                  <p className="text-sm text-gray-600">Certificados</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <Calendar className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{selectedEvent.hours}h</p>
                  <p className="text-sm text-gray-600">Duração</p>
                </div>
              </div>

              {/* Event Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Categoria</h4>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {selectedEvent.category || 'Geral'}
                  </span>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Taxa de Ocupação</h4>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                        style={{ width: `${selectedEvent.maxVolunteers > 0 ? (selectedEvent.volunteers / selectedEvent.maxVolunteers) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {selectedEvent.volunteers}/{selectedEvent.maxVolunteers}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Avaliação Média</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Award
                          key={star}
                          className={`h-6 w-6 ${star <= (selectedEvent.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-700">
                      {selectedEvent.rating || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleDownloadReport(selectedEvent)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Relatório
                </button>
                <button
                  onClick={() => {
                    handleViewCertificates(selectedEvent);
                    setShowDetailsModal(false);
                  }}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center font-medium"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Ver Certificados
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificates Modal */}
      {showCertificatesModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Certificados do Evento</h2>
                <p className="text-gray-600 text-sm mt-1">{selectedEvent.title}</p>
              </div>
              <button
                onClick={() => setShowCertificatesModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Emitidos</p>
                      <p className="text-2xl font-bold text-green-600">
                        {certificatesForEvent.filter(c => c.status === 'issued').length}
                      </p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pendentes</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {certificatesForEvent.filter(c => c.status === 'pending').length}
                      </p>
                    </div>
                    <XCircle className="h-10 w-10 text-yellow-500" />
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {certificatesForEvent.length}
                      </p>
                    </div>
                    <Award className="h-10 w-10 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Certificates List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Lista de Certificados</h3>
                {certificatesForEvent.map((cert) => (
                  <div
                    key={cert.id}
                    className={`border rounded-lg p-4 flex items-center justify-between ${
                      cert.status === 'issued' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                          {cert.volunteerName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{cert.volunteerName}</h4>
                          <p className="text-sm text-gray-600">{cert.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Horas</p>
                          <p className="font-medium text-gray-800">{cert.hours}h</p>
                        </div>
                        {cert.issueDate && (
                          <div>
                            <p className="text-gray-500">Data de Emissão</p>
                            <p className="font-medium text-gray-800">{cert.issueDate}</p>
                          </div>
                        )}
                        {cert.certificateCode && (
                          <div>
                            <p className="text-gray-500">Código</p>
                            <p className="font-medium text-gray-800 font-mono text-xs">{cert.certificateCode}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {cert.status === 'issued' ? (
                        <>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Emitido
                          </span>
                          <button
                            onClick={() => toast.success('Download iniciado!')}
                            className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-sm"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Baixar
                          </button>
                          <button
                            onClick={() => toast.info('Visualização em nova aba')}
                            className="px-3 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center text-sm"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center">
                            <XCircle className="h-3 w-3 mr-1" />
                            Pendente
                          </span>
                          <button
                            onClick={() => toast.success('Certificado emitido com sucesso!')}
                            className="px-3 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center text-sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Emitir
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => toast.success('Todos os certificados foram baixados!')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Todos
                </button>
                <button
                  onClick={() => toast.success('Certificados pendentes emitidos!')}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center font-medium"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Emitir Pendentes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClosedEvents;
