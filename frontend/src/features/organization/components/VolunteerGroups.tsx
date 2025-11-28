'use client';

import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, UserPlus, UserMinus, X, Save, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Volunteer {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface VolunteerGroup {
  id: number;
  name: string;
  description: string;
  leader?: Volunteer;
  members: Volunteer[];
  color: string;
}

interface VolunteerGroupsProps {
  eventId: number;
  eventTitle: string;
  availableVolunteers: Volunteer[];
  onClose: () => void;
}

const GROUP_COLORS = [
  { name: 'Azul', value: 'bg-blue-100 border-blue-300 text-blue-800' },
  { name: 'Verde', value: 'bg-green-100 border-green-300 text-green-800' },
  { name: 'Amarelo', value: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { name: 'Roxo', value: 'bg-purple-100 border-purple-300 text-purple-800' },
  { name: 'Rosa', value: 'bg-pink-100 border-pink-300 text-pink-800' },
  { name: 'Laranja', value: 'bg-orange-100 border-orange-300 text-orange-800' }
];

const VolunteerGroups: React.FC<VolunteerGroupsProps> = ({
  eventId,
  eventTitle,
  availableVolunteers,
  onClose
}) => {
  const [groups, setGroups] = useState<VolunteerGroup[]>([
    {
      id: 1,
      name: 'Equipe A',
      description: 'Responsável pela recepção',
      members: availableVolunteers.slice(0, 3),
      color: GROUP_COLORS[0].value
    },
    {
      id: 2,
      name: 'Equipe B',
      description: 'Responsável pela organização',
      members: availableVolunteers.slice(3, 6),
      color: GROUP_COLORS[1].value
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<VolunteerGroup | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupColor, setNewGroupColor] = useState(GROUP_COLORS[0].value);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [targetGroup, setTargetGroup] = useState<VolunteerGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const assignedVolunteerIds = new Set(
    groups.flatMap(g => g.members.map(m => m.id))
  );

  const unassignedVolunteers = availableVolunteers.filter(
    v => !assignedVolunteerIds.has(v.id)
  );

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast.error('Nome do grupo é obrigatório');
      return;
    }

    if (editingGroup) {
      setGroups(groups.map(g =>
        g.id === editingGroup.id
          ? { ...g, name: newGroupName, description: newGroupDescription, color: newGroupColor }
          : g
      ));
      toast.success('Grupo atualizado com sucesso!');
    } else {
      const newGroup: VolunteerGroup = {
        id: Date.now(),
        name: newGroupName,
        description: newGroupDescription,
        members: [],
        color: newGroupColor
      };
      setGroups([...groups, newGroup]);
      toast.success('Grupo criado com sucesso!');
    }

    resetCreateModal();
  };

  const resetCreateModal = () => {
    setShowCreateModal(false);
    setEditingGroup(null);
    setNewGroupName('');
    setNewGroupDescription('');
    setNewGroupColor(GROUP_COLORS[0].value);
  };

  const handleEditGroup = (group: VolunteerGroup) => {
    setEditingGroup(group);
    setNewGroupName(group.name);
    setNewGroupDescription(group.description);
    setNewGroupColor(group.color);
    setShowCreateModal(true);
  };

  const handleDeleteGroup = (groupId: number) => {
    setGroups(groups.filter(g => g.id !== groupId));
    toast.success('Grupo removido com sucesso!');
  };

  const handleAddMemberToGroup = (group: VolunteerGroup) => {
    setTargetGroup(group);
    setShowAddMemberModal(true);
  };

  const handleAssignVolunteer = (volunteer: Volunteer) => {
    if (!targetGroup) return;

    setGroups(groups.map(g =>
      g.id === targetGroup.id
        ? { ...g, members: [...g.members, volunteer] }
        : g
    ));

    toast.success(`${volunteer.name} adicionado ao grupo ${targetGroup.name}`);
    setShowAddMemberModal(false);
    setTargetGroup(null);
  };

  const handleRemoveMember = (groupId: number, volunteerId: number) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, members: g.members.filter(m => m.id !== volunteerId) }
        : g
    ));
    toast.success('Voluntário removido do grupo');
  };

  const handleSetLeader = (groupId: number, volunteer: Volunteer) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, leader: volunteer }
        : g
    ));
    toast.success(`${volunteer.name} definido como líder`);
  };

  const filteredUnassigned = unassignedVolunteers.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">Grupos de Voluntários</h2>
              <p className="text-white/90 text-sm">{eventTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{groups.length}</p>
            <p className="text-sm text-gray-600">Grupos Criados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">
              {groups.reduce((sum, g) => sum + g.members.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Voluntários Atribuídos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{unassignedVolunteers.length}</p>
            <p className="text-sm text-gray-600">Sem Grupo</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Create Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full mb-6 py-4 border-2 border-dashed border-gray-300 rounded-lg text-primary hover:border-primary hover:bg-primary/5 font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Criar Novo Grupo</span>
          </button>

          {/* Groups List */}
          <div className="space-y-4">
            {groups.map(group => (
              <div
                key={group.id}
                className={`border-2 rounded-lg p-4 ${group.color}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Users className="h-5 w-5" />
                      <h3 className="text-lg font-bold">{group.name}</h3>
                      <span className="px-2 py-1 bg-white/50 rounded-full text-xs font-medium">
                        {group.members.length} membros
                      </span>
                    </div>
                    <p className="text-sm opacity-80">{group.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditGroup(group)}
                      className="p-2 hover:bg-white/30 rounded-lg transition-colors"
                      aria-label="Editar grupo"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="p-2 hover:bg-white/30 rounded-lg transition-colors"
                      aria-label="Remover grupo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {group.leader && (
                  <div className="mb-3 p-2 bg-white/50 rounded-lg">
                    <p className="text-xs font-medium mb-1">Líder do Grupo:</p>
                    <p className="text-sm font-semibold">{group.leader.name}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {group.members.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between bg-white/70 rounded-lg p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs opacity-70">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {group.leader?.id !== member.id && (
                          <button
                            onClick={() => handleSetLeader(group.id, member)}
                            className="px-3 py-1 text-xs bg-white hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Definir Líder
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMember(group.id, member.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          aria-label="Remover membro"
                        >
                          <UserMinus className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleAddMemberToGroup(group)}
                  className="w-full mt-3 py-2 bg-white/50 hover:bg-white/70 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Adicionar Membro</span>
                </button>
              </div>
            ))}
          </div>

          {/* Unassigned Volunteers */}
          {unassignedVolunteers.length > 0 && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Voluntários Sem Grupo ({unassignedVolunteers.length})
              </h3>
              <div className="space-y-2">
                {unassignedVolunteers.map(volunteer => (
                  <div
                    key={volunteer.id}
                    className="flex items-center justify-between bg-white rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {volunteer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{volunteer.name}</p>
                        <p className="text-xs text-gray-600">{volunteer.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create/Edit Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {editingGroup ? 'Editar Grupo' : 'Criar Novo Grupo'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Grupo *
                  </label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ex: Equipe de Recepção"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Descreva as responsabilidades do grupo..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor do Grupo
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {GROUP_COLORS.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setNewGroupColor(color.value)}
                        className={`p-3 rounded-lg border-2 ${color.value} ${
                          newGroupColor === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                        }`}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={resetCreateModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateGroup}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingGroup ? 'Salvar' : 'Criar'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && targetGroup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Adicionar Membro ao {targetGroup.name}
              </h3>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Buscar voluntário..."
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredUnassigned.length === 0 ? (
                  <p className="text-center text-gray-600 py-4">
                    Nenhum voluntário disponível
                  </p>
                ) : (
                  filteredUnassigned.map(volunteer => (
                    <button
                      key={volunteer.id}
                      onClick={() => handleAssignVolunteer(volunteer)}
                      className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                        {volunteer.name.charAt(0)}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-sm">{volunteer.name}</p>
                        <p className="text-xs text-gray-600">{volunteer.email}</p>
                      </div>
                      <UserPlus className="h-5 w-5 text-primary" />
                    </button>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setTargetGroup(null);
                  setSearchTerm('');
                }}
                className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerGroups;
