import React, { useState } from 'react';
import { User, Material, Loan } from '../types';
import { Calendar, ArrowRight, RotateCcw } from 'lucide-react';

interface LoanManagementProps {
  users: User[];
  materials: Material[];
  loans: Loan[];
  onAddLoan: (loan: Omit<Loan, 'id' | 'status'>) => void;
  onReturnMaterial: (loanId: string) => void;
}

export default function LoanManagement({ users, materials, loans, onAddLoan, onReturnMaterial }: LoanManagementProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [hasReturnDate, setHasReturnDate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId && selectedMaterialId) {
      onAddLoan({
        userId: selectedUserId,
        materialId: selectedMaterialId,
        borrowDate: new Date(),
        expectedReturnDate: hasReturnDate && expectedReturnDate ? new Date(expectedReturnDate) : undefined,
        actualReturnDate: undefined,
      });
      setSelectedUserId('');
      setSelectedMaterialId('');
      setExpectedReturnDate('');
      setHasReturnDate(false);
    }
  };

  const getActiveLoan = (materialId: string): Loan | undefined => {
    return loans.find(loan => loan.materialId === materialId && loan.status === 'active');
  };

  const availableMaterials = materials.filter(material => !getActiveLoan(material.id));
  const activeLoans = loans.filter(loan => loan.status === 'active');

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu';
  };

  const getMaterialName = (materialId: string): string => {
    const material = materials.find(m => m.id === materialId);
    return material ? material.name : 'Matériel inconnu';
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const isOverdue = (expectedReturnDate?: Date): boolean => {
    if (!expectedReturnDate) return false;
    return new Date() > new Date(expectedReturnDate);
  };

  return (
    <div className="space-y-6">
      {/* New Loan Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-800">Nouvel emprunt</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                Utilisateur
              </label>
              <select
                id="userId"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner un utilisateur</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="materialId" className="block text-sm font-medium text-gray-700 mb-1">
                Matériel disponible
              </label>
              <select
                id="materialId"
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner du matériel</option>
                {availableMaterials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} ({material.category})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasReturnDate"
                checked={hasReturnDate}
                onChange={(e) => setHasReturnDate(e.target.checked)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="hasReturnDate" className="text-sm font-medium text-gray-700">
                Définir une date de retour prévue
              </label>
            </div>
            
            {hasReturnDate && (
              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de retour prévue
                </label>
                <input
                  type="date"
                  id="returnDate"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required={hasReturnDate}
                />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={users.length === 0 || availableMaterials.length === 0}
            className="w-full md:w-auto bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
            Enregistrer l'emprunt
          </button>
          
          {users.length === 0 && (
            <p className="text-sm text-red-600">Ajoutez d'abord des utilisateurs pour pouvoir enregistrer un emprunt.</p>
          )}
          {availableMaterials.length === 0 && users.length > 0 && (
            <p className="text-sm text-red-600">Aucun matériel disponible pour l'emprunt.</p>
          )}
        </form>
      </div>

      {/* Active Loans */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">Emprunts en cours ({activeLoans.length})</h2>
        </div>
        
        {activeLoans.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucun emprunt en cours</p>
        ) : (
          <div className="space-y-4">
            {activeLoans.map((loan) => {
              const overdue = isOverdue(loan.expectedReturnDate);
              
              return (
                <div key={loan.id} className={`border rounded-lg p-4 ${overdue ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div>
                          <h3 className="font-medium text-gray-800">{getUserName(loan.userId)}</h3>
                          <p className="text-sm text-gray-600">{getMaterialName(loan.materialId)}</p>
                        </div>
                        {overdue && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            En retard
                          </span>
                        )}
                        {!loan.expectedReturnDate && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Durée indéterminée
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>Emprunté le: {formatDate(loan.borrowDate)}</p>
                        {loan.expectedReturnDate ? (
                          <p className={overdue ? 'text-red-600 font-medium' : ''}>
                            Retour prévu: {formatDate(loan.expectedReturnDate)}
                          </p>
                        ) : (
                          <p className="text-blue-600">Pas de date de retour définie</p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onReturnMaterial(loan.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retourner
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}