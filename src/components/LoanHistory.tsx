import React, { useState } from 'react';
import { User, Material, Loan } from '../types';
import { History, Download, Filter } from 'lucide-react';

interface LoanHistoryProps {
  users: User[];
  materials: Material[];
  loans: Loan[];
}

export default function LoanHistory({ users, materials, loans }: LoanHistoryProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'returned'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'user' | 'material'>('date');

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu';
  };

  const getMaterialInfo = (materialId: string): { name: string; category: string } => {
    const material = materials.find(m => m.id === materialId);
    return material ? { name: material.name, category: material.category } : { name: 'Matériel inconnu', category: '' };
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString('fr-FR');
  };

  const isOverdue = (loan: Loan): boolean => {
    if (loan.status === 'returned' || !loan.expectedReturnDate) return false;
    return new Date() > new Date(loan.expectedReturnDate);
  };

  const getDaysLate = (loan: Loan): number => {
    if (loan.status === 'returned' || !loan.expectedReturnDate) return 0;
    const now = new Date();
    const expected = new Date(loan.expectedReturnDate);
    const diffTime = now.getTime() - expected.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const filteredLoans = loans
    .filter(loan => {
      if (filterStatus === 'active') return loan.status === 'active';
      if (filterStatus === 'returned') return loan.status === 'returned';
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'user':
          return getUserName(a.userId).localeCompare(getUserName(b.userId));
        case 'material':
          return getMaterialInfo(a.materialId).name.localeCompare(getMaterialInfo(b.materialId).name);
        case 'date':
        default:
          return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
      }
    });

  const exportData = () => {
    const exportLoans = filteredLoans.map(loan => ({
      utilisateur: getUserName(loan.userId),
      materiel: getMaterialInfo(loan.materialId).name,
      categorie: getMaterialInfo(loan.materialId).category,
      dateEmprunt: formatDate(loan.borrowDate),
      dateRetourPrevue: loan.expectedReturnDate ? formatDate(loan.expectedReturnDate) : 'Non définie',
      dateRetourEffective: loan.actualReturnDate ? formatDate(loan.actualReturnDate) : '',
      statut: loan.status === 'active' ? 'En cours' : 'Retourné',
      enRetard: isOverdue(loan) ? 'Oui' : 'Non',
      joursRetard: getDaysLate(loan)
    }));

    const dataStr = JSON.stringify(exportLoans, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historique_emprunts_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: loans.length,
    active: loans.filter(l => l.status === 'active').length,
    returned: loans.filter(l => l.status === 'returned').length,
    overdue: loans.filter(l => isOverdue(l)).length
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total emprunts</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
          <div className="text-sm text-gray-600">En cours</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">{stats.returned}</div>
          <div className="text-sm text-gray-600">Retournés</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-600">En retard</div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Historique des emprunts ({filteredLoans.length})
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous</option>
                <option value="active">En cours</option>
                <option value="returned">Retournés</option>
              </select>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Trier par date</option>
              <option value="user">Trier par utilisateur</option>
              <option value="material">Trier par matériel</option>
            </select>
            
            <button
              onClick={exportData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
        
        {filteredLoans.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucun emprunt trouvé</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Utilisateur</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Matériel</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Date d'emprunt</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Retour prévu</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Retour effectif</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => {
                  const materialInfo = getMaterialInfo(loan.materialId);
                  const overdue = isOverdue(loan);
                  const daysLate = getDaysLate(loan);
                  
                  return (
                    <tr key={loan.id} className={`border-b border-gray-100 hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}>
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium text-gray-800">{getUserName(loan.userId)}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium text-gray-800">{materialInfo.name}</div>
                          <div className="text-gray-500 text-xs">{materialInfo.category}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {formatDate(loan.borrowDate)}
                      </td>
                      <td className="py-3 px-2">
                        {loan.expectedReturnDate ? (
                          <div className={overdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                            {formatDate(loan.expectedReturnDate)}
                            {overdue && daysLate > 0 && (
                              <div className="text-xs text-red-500">
                                +{daysLate} jour{daysLate > 1 ? 's' : ''} de retard
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-blue-600 text-sm">Non définie</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {loan.actualReturnDate ? formatDate(loan.actualReturnDate) : '-'}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          loan.status === 'active'
                            ? overdue 
                              ? 'bg-red-100 text-red-800'
                              : !loan.expectedReturnDate
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {loan.status === 'active' 
                            ? overdue 
                              ? 'En retard' 
                              : !loan.expectedReturnDate 
                                ? 'Durée indéterminée'
                                : 'En cours'
                            : 'Retourné'
                          }
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}