'use client';

import React from 'react';
import { DUMMY_EVENTS } from '@/lib/services/getDataseService';
import { Event } from '@/lib/types';
import { IoAlertCircleOutline, IoArrowForward } from 'react-icons/io5';


const EmergencyCard: React.FC<{ event: Event }> = ({ event }) => (
  <div className="bg-red-50 p-6 rounded-xl shadow-lg border-2 border-red-500 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
    <div>
      <div className="flex items-center space-x-3 mb-3 text-red-700">
        <IoAlertCircleOutline className="text-3xl" />
        <p className="text-sm font-bold uppercase">ALERTA: {event.date}</p>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
      <p className="text-gray-700 line-clamp-3 mb-4">{event.description}</p>
    </div>
    <button className="flex items-center justify-center space-x-2 w-full mt-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md">
      <span>Quero Ajudar Agora</span>
      <IoArrowForward />
    </button>
  </div>
);

export default function EmergencyVolunteerSection() {

  // Filtra eventos por isEmergency=true e limita aos 3 primeiros
  const emergencyEvents = DUMMY_EVENTS
    .filter(event => event.isEmergency)
    .slice(0, 3); 

  if (emergencyEvents.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-aux-2-translucid backdrop-blur-xs">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-red-700">Chamado de Emergência!</h2>
          <p className="text-lg text-gray-600 mt-2">As causas mais urgentes que precisam da sua ajuda agora mesmo.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {emergencyEvents.map((event) => (
            <EmergencyCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}