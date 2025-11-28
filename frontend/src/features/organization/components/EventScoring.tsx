'use client';

import React, { useState } from 'react';
import { ArrowLeft, Award, CheckCircle, Star, Users, FileText, Send } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_EVENT_PARTICIPANTS } from '@/lib/services/orgData';
import { EventParticipant } from '@/lib/orgtypes';
import { closeEvent } from '@/lib/services/event.service';

interface EventScoringProps {
  event: {
    id: number;
    title: string;
  };
  onBack: () => void;
}

const EventScoring: React.FC<EventScoringProps> = ({ event, onBack }) => {
  const [participants, setParticipants] = useState<EventParticipant[]>(MOCK_EVENT_PARTICIPANTS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateParticipant = (id: number, field: keyof EventParticipant, value: string | number | boolean) => {
    setParticipants(participants.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSubmit = async () => {
    const attendedCount = participants.filter(p => p.attended).length;
    const certificatesCount = participants.filter(p => p.issueCertificate).length;

    const userConfirmed = await new Promise<boolean>((resolve) => {
      toast(
        <div className="flex flex-col space-y-2">
          <p className="font-semibold">Confirmar encerramento do evento?</p>
          <p className="text-sm">{attendedCount} participantes presentes</p>
          <p className="text-sm">{certificatesCount} certificados serão emitidos</p>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => {
                resolve(true);
                toast.dismiss();
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
            >
              Confirmar
            </button>
            <button
              onClick={() => {
                resolve(false);
                toast.dismiss();
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>,
        { duration: 10000 }
      );
    });

    if (userConfirmed) {
      setIsSubmitting(true);
      try {
        await closeEvent(event.id);
        toast.success('Evento encerrado com sucesso! Pontuações atribuídas e certificados emitidos.');
        onBack();
      } catch (error) {
        console.error('Error closing event:', error);
        toast.error('Erro ao encerrar evento.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const attendedCount = participants.filter(p => p.attended).length;
  const totalCertificates = participants.filter(p => p.issueCertificate).length;
  const totalHours = participants.reduce((sum, p) => sum + p.hoursWorked, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar para Eventos Abertos
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Encerrar Evento e Pontuar Voluntários</h2>
        <p className="text-gray-600">Evento: <span className="font-semibold">{event.title}</span></p>
      </div>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{participants.length}</p>
            <p className="text-sm text-gray-600">Participantes</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{attendedCount}</p>
            <p className="text-sm text-gray-600">Presentes</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-green-100 rounded-lg p-4">
            <Award className="h-8 w-8 text-primary mb-2" />
            <p className="text-2xl font-bold text-gray-800">{totalCertificates}</p>
            <p className="text-sm text-gray-600">Certificados</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <Star className="h-8 w-8 text-orange-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{totalHours}h</p>
            <p className="text-sm text-gray-600">Total de Horas</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Instruções:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Marque a presença de cada voluntário que compareceu</li>
            <li>• Atribua a pontuação de acordo com o desempenho (0-100 pontos)</li>
            <li>• Defina as horas trabalhadas por cada participante</li>
            <li>• Selecione quem receberá certificado de participação</li>
            <li>• Adicione observações se necessário</li>
          </ul>
        </div>

        {/* Participants Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voluntário
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presente
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pontuação
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map(participant => (
                <tr key={participant.id} className={!participant.attended ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                      <div className="text-sm text-gray-500">{participant.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {participant.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={participant.attended}
                      onChange={(e) => {
                        updateParticipant(participant.id, 'attended', e.target.checked);
                        if (!e.target.checked) {
                          updateParticipant(participant.id, 'score', 0);
                          updateParticipant(participant.id, 'hoursWorked', 0);
                          updateParticipant(participant.id, 'issueCertificate', false);
                        }
                      }}
                      className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <input
                      type="number"
                      value={participant.hoursWorked}
                      onChange={(e) => updateParticipant(participant.id, 'hoursWorked', parseInt(e.target.value) || 0)}
                      disabled={!participant.attended}
                      min="0"
                      max="24"
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <input
                      type="number"
                      value={participant.score}
                      onChange={(e) => updateParticipant(participant.id, 'score', parseInt(e.target.value) || 0)}
                      disabled={!participant.attended}
                      min="0"
                      max="100"
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={participant.issueCertificate}
                      onChange={(e) => updateParticipant(participant.id, 'issueCertificate', e.target.checked)}
                      disabled={!participant.attended}
                      className="h-5 w-5 text-primary rounded focus:ring-primary disabled:opacity-50"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={participant.notes}
                      onChange={(e) => updateParticipant(participant.id, 'notes', e.target.value)}
                      placeholder="Observações..."
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <div className="space-x-4">
            <button className="px-6 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center inline-flex">
              <FileText className="h-4 w-4 mr-2" />
              Salvar Rascunho
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center inline-flex font-medium"
            >
              <Send className="h-4 w-4 mr-2" />
              Encerrar Evento e Emitir Certificados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventScoring;
