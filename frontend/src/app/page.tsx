'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BenefitSection from '@/components/ui/BenefitSection';
import Carousel from '@/components/ui/Carousel';
import UpcomingEvents from '@/components/ui/UpcomingEvents';
import NewsSection from '@/components/ui/NewsSection';
import EmergencyVolunteerSection from '@/components/ui/EmergencyVolunteerSection';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 relative">
      <div className="absolute inset-0 bg-[url('/bg3.png')] bg-cover bg-center bg-fixed opacity-50 z-0"></div>

      <Header
        isLoggedIn={false}
        onNavigate={(page) => {
          if (page === 'login') {
            router.push('/login');
          } else if (page === 'register') {
            router.push('/register');
          }
        }}
        onLogout={() => {}}
      />

      <main className="container mx-auto px-4 relative z-10">
        <section className="max-w-[85%] m-auto text-center pt-10 bg-aux-2-translucid backdrop-blur-xs transition duration-600 transform hover:backdrop-blur-xl hover:scale-101 rounded-xl shadow-lg">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Conectando <span className="text-primary">Voluntários</span> e <span className="text-primary">Causas</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Uma plataforma para simplificar a gestão de voluntários, facilitando a organização, a escala e a comunicação para eventos.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full md:w-auto px-8 py-3 bg-primary-hover text-white rounded-lg shadow-xl transition duration-300 transform hover:scale-105"
            >
              Acessar Minha Conta
            </button>
            <button
              onClick={() => console.log('Explorar Eventos')}
              className="w-full md:w-auto px-8 py-3 bg-white text-primary rounded-lg shadow-xl border border-primary hover:bg-orange-50 transition duration-300 transform hover:scale-105"
            >
              Explorar Eventos
            </button>
          </div>
          <div className="px-4 mt-8">
            <Carousel>

              <BenefitSection /> 
              <UpcomingEvents />
              <NewsSection />
              <EmergencyVolunteerSection /> 
            
            </Carousel>
          </div>
        </section>
      </main>
    </div>
  );
}
