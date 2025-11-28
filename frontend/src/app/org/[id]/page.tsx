import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Globe, Mail, Phone, Calendar, Award } from 'lucide-react';
import { getOrganizationById } from '@/lib/services/organization.service';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OrganizationProfilePage({ params }: PageProps) {
    const { id } = await params;
    const organization = await getOrganizationById(id);

    if (!organization) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Banner */}
            <div className="relative h-64 md:h-80 w-full bg-green-800">
                {organization.bannerUrl && (
                    <Image
                        src={organization.bannerUrl}
                        alt="Banner"
                        fill
                        className="object-cover opacity-80"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Logo */}
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white shrink-0">
                            <Image
                                src={organization.logoUrl}
                                alt={organization.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Header Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{organization.name}</h1>
                            <div className="flex flex-wrap gap-4 text-gray-600 text-sm md:text-base">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1 text-green-600" />
                                    {organization.address.city}, {organization.address.state}
                                </div>
                                {organization.website && (
                                    <a href={organization.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green-600 transition-colors">
                                        <Globe className="w-4 h-4 mr-1 text-blue-500" />
                                        Website
                                    </a>
                                )}
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-1 text-gray-500" />
                                    {organization.email}
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto mt-6 md:mt-0">
                            <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                                <div className="text-2xl font-bold text-green-700">{organization.stats.totalEvents}</div>
                                <div className="text-xs text-green-600 font-medium uppercase">Eventos</div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                                <div className="text-2xl font-bold text-blue-700">{organization.stats.totalVolunteers}</div>
                                <div className="text-xs text-blue-600 font-medium uppercase">Voluntários</div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-8 border-gray-100" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: About & Mission */}
                        <div className="lg:col-span-2 space-y-8">
                            <section>
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    Sobre Nós
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {organization.description}
                                </p>
                            </section>

                            <section className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                                <h2 className="text-xl font-bold text-amber-800 mb-3 flex items-center">
                                    Nossa Missão
                                </h2>
                                <p className="text-amber-900/80 italic text-lg font-medium">
                                    &quot;{organization.mission}&quot;
                                </p>
                            </section>

                            {/* Historical Events */}
                            <section>
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                                    Histórico de Eventos
                                </h2>
                                <div className="space-y-4">
                                    {organization.historicalEvents.map((event) => (
                                        <div key={event.id} className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                                                <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                                                    <span className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {event.date}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {event.location}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mt-2 line-clamp-2 text-sm">{event.description}</p>
                                            </div>
                                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-row md:flex-col items-center justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 min-w-[120px]">
                                                <div className="text-center">
                                                    <div className="text-sm text-gray-500">Avaliação</div>
                                                    <div className="font-bold text-amber-500 flex items-center justify-center">
                                                        <Award className="w-4 h-4 mr-1" />
                                                        {event.rating}
                                                    </div>
                                                </div>
                                                <div className="text-center hidden md:block">
                                                    <div className="text-sm text-gray-500">Horas</div>
                                                    <div className="font-bold text-gray-700">{event.hours}h</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Contact & Info */}
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-8">
                                <h3 className="font-bold text-gray-900 mb-4">Informações de Contato</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                        <span className="text-gray-600 text-sm">
                                            {organization.address.street}<br />
                                            {organization.address.city} - {organization.address.state}<br />
                                            CEP: {organization.address.zipCode}
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <Phone className="w-5 h-5 text-gray-400 mr-3" />
                                        <span className="text-gray-600 text-sm">{organization.phone}</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                        <a href={`mailto:${organization.email}`} className="text-green-600 text-sm hover:underline">
                                            {organization.email}
                                        </a>
                                    </li>
                                    {organization.website && (
                                        <li className="flex items-center">
                                            <Globe className="w-5 h-5 text-gray-400 mr-3" />
                                            <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-green-600 text-sm hover:underline">
                                                {organization.website}
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
