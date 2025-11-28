import React from 'react';

const BenefitSection: React.FC = () => {
    return (
        <div className="mt-12 p-8 backdrop-blur-md rounded-lg">
            {/* Fonte aumentada para o título principal (text-3xl para text-4xl) */}
            <h3 className="text-4xl font-bold text-gray-800 mb-6">Benefícios do REVO</h3>
            <div className="grid md:grid-cols-2 gap-10 text-left">
                <div className="p-4 rounded-lg bg-white/50 shadow-inner">
                    {/* Fonte aumentada para o título da seção (text-xl para text-2xl) */}
                    <h4 className="text-2xl font-semibold text-primary mb-4">Para Voluntários</h4>
                    {/* Fonte aumentada para a lista (text-lg) */}
                    <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
                        <li>Sensação de realização pessoal</li>
                        <li>Acesso fácil a oportunidades de voluntariado</li>
                        <li>Comunicação direta com organizadores</li>
                        <li>Networking com pessoas e ONGs engajadas</li>
                    </ul>
                </div>
                <div className="p-4 rounded-lg bg-white/50 shadow-inner">
                    {/* Fonte aumentada para o título da seção (text-xl para text-2xl) */}
                    <h4 className="text-2xl font-semibold text-primary mb-4">Para Organizações</h4>
                    {/* Fonte aumentada para a lista (text-lg) */}
                    <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
                        <li>Economia com pessoal e recursos</li>
                        <li>Banco de dados centralizado de voluntários</li>
                        <li>Maior facilidade e eficiência no gerenciamento</li>
                        <li>Aumento da visibilidade e credibilidade da causa</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BenefitSection;