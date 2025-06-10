import React, { useState } from 'react';
import { Material, Loan } from '../types';
import { Package, Plus, Filter } from 'lucide-react';

interface MaterialManagementProps {
  materials: Material[];
  loans: Loan[];
  onAddMaterial: (material: Omit<Material, 'id' | 'createdAt'>) => void;
}

const CATEGORIES = [
  'Ordinateur portable',
  'Ordinateur fixe',
  'Écran/Moniteur',
  'Clavier',
  'Souris',
  'Casque audio',
  'Webcam',
  'Tablette',
  'Smartphone',
  'Imprimante',
  'Scanner',
  'Projecteur',
  'Câble/Adaptateur',
  'Disque dur externe',
  'Autre matériel informatique'
];

export default function MaterialManagement({ materials, loans, onAddMaterial }: MaterialManagementProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [filter, setFilter] = useState<'all' | 'available' | 'borrowed'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && category.trim()) {
      onAddMaterial({ name: name.trim(), category: category.trim() });
      setName('');
      setCategory('');
    }
  };

  const getActiveLoan = (materialId: string): Loan | undefined => {
    return loans.find(loan => loan.materialId === materialId && loan.status === 'active');
  };

  const filteredMaterials = materials.filter(material => {
    const isAvailable = !getActiveLoan(material.id);
    if (filter === 'available') return isAvailable;
    if (filter === 'borrowed') return !isAvailable;
    return true;
  });

  const availableCount = materials.filter(m => !getActiveLoan(m.id)).length;
  const borrowedCount = materials.length - availableCount;

  return (
    <div className="space-y-6">
      {/* Add Material Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">Ajouter du matériel</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="materialName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du matériel
              </label>
              <input
                type="text"
                id="materialName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="ex: MacBook Pro, Souris Logitech..."
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter le matériel
          </button>
        </form>
      </div>

      {/* Materials List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Liste du matériel ({filteredMaterials.length})
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tout ({materials.length})</option>
              <option value="available">Disponible ({availableCount})</option>
              <option value="borrowed">Emprunté ({borrowedCount})</option>
            </select>
          </div>
        </div>
        
        {filteredMaterials.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {materials.length === 0 ? 'Aucun matériel enregistré' : 'Aucun matériel correspondant au filtre'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material) => {
              const activeLoan = getActiveLoan(material.id);
              const isAvailable = !activeLoan;
              
              return (
                <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{material.name}</h3>
                        <p className="text-sm text-gray-500">{material.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isAvailable ? 'Disponible' : 'Emprunté'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">ID: {material.id}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}