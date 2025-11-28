import React, { useEffect, useState } from 'react';
import { Event } from '@/lib/types';
import { BsCalendarEvent } from 'react-icons/bs';
import { IoArrowForward } from 'react-icons/io5';
import { getUpcomingEvents } from '@/lib/services/event.service';

const EventCard: React.FC<{ event: Event }> = ({ event }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col justify-between h-full">
    <div>
      <div className="flex items-center space-x-3 mb-3">
        <BsCalendarEvent className="text-primary text-2xl" />
        <p className="text-sm font-semibold text-gray-500 uppercase">{event.date}</p>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
      <p className="text-gray-600 line-clamp-3 mb-4">{event.description}</p>
    </div>
    <button className="flex items-center justify-center space-x-2 w-full mt-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors shadow-md">
      <span>Ver Detalhes</span>
      <IoArrowForward />
    </button>
  </div>
);

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUpcomingEvents();
        setEvents(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to load events', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 text-center">
        <p>Carregando eventos...</p>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800">Próximos Eventos de Voluntariado</h2>
        <p className="text-lg text-gray-600 mt-2">Encontre uma causa que te move e comece a fazer a diferença hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}