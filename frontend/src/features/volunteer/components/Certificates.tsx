'use client';

import React, { useState, useMemo } from 'react';
import { Award, Download, Share2, Eye, Calendar, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Certificate, UserStatsDTO } from '@/lib/types';
import { transformCertificates } from '@/lib/services/dashboard.service';

interface CertificatesProps {
  dashboardData: UserStatsDTO;
}

const Certificates: React.FC<CertificatesProps> = ({ dashboardData }) => {
  const certificates = useMemo(() => transformCertificates(dashboardData.certificados), [dashboardData]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Disponível
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Em Processamento
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <Clock className="h-3 w-3 mr-1" />
            Aguardando
          </span>
        );
    }
  };

  const handleDownload = (cert: Certificate) => {
    toast.success(`Baixando certificado: ${cert.eventName}`);
  };

  const handleShare = (cert: Certificate) => {
    toast.success(`Compartilhando certificado: ${cert.eventName}`);
  };

  const handlePreview = (cert: Certificate) => {
    setSelectedCertificate(cert);
  };

  const totalHours = certificates.reduce((sum, cert) => sum + cert.hours, 0);
  const availableCerts = certificates.filter(c => c.status === 'available').length;

  return (
    <div className="p-6 bg-stone-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificados</h2>
        <p className="text-gray-600">Seus certificados de participação em eventos de voluntariado</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <Award className="h-10 w-10 text-blue-600 mb-3" />
          <p className="text-3xl font-bold text-gray-800 mb-1">{certificates.length}</p>
          <p className="text-sm text-gray-600">Total de Certificados</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <CheckCircle className="h-10 w-10 text-green-600 mb-3" />
          <p className="text-3xl font-bold text-gray-800 mb-1">{availableCerts}</p>
          <p className="text-sm text-gray-600">Disponíveis para Download</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-green-100 rounded-lg p-6">
          <Clock className="h-10 w-10 text-primary mb-3" />
          <p className="text-3xl font-bold text-gray-800 mb-1">{totalHours}h</p>
          <p className="text-sm text-gray-600">Horas Certificadas</p>
        </div>
      </div>

      {/* Certificates List */}
      <div className="space-y-4">
        {certificates.map(cert => (
          <div key={cert.id} className="border border-gray-200 bg-white rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">{cert.eventName}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{cert.organization}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {cert.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {cert.hours}h
                  </span>
                </div>
              </div>
              <div>
                {getStatusBadge(cert.status)}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Código: <span className="font-mono font-medium text-gray-700">{cert.code}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePreview(cert)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Visualizar"
                >
                  <Eye className="h-5 w-5" />
                </button>
                {cert.status === 'available' && (
                  <>
                    <button
                      onClick={() => handleShare(cert)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Compartilhar"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(cert)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center font-medium"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Preview Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {/* Certificate Preview */}
            <div className="border-4 border-double border-blue-600 p-8 text-center">
              <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Certificado de Participação</h2>
              <p className="text-gray-600 mb-6">
                Certificamos que <span className="font-semibold text-gray-800">Maria Silva</span> participou como voluntário(a) no evento
              </p>
              <h3 className="text-2xl font-bold text-blue-600 mb-4">{selectedCertificate.eventName}</h3>
              <p className="text-gray-600 mb-4">
                Realizado por <span className="font-semibold">{selectedCertificate.organization}</span>
              </p>
              <p className="text-gray-600 mb-6">
                Em {selectedCertificate.date}, com carga horária de {selectedCertificate.hours} horas
              </p>
              <div className="border-t border-gray-300 pt-6 mt-6">
                <p className="text-xs text-gray-500">
                  Código de Verificação: {selectedCertificate.code}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => handleDownload(selectedCertificate)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center font-medium"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </button>
              <button
                onClick={() => handleShare(selectedCertificate)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center font-medium"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
