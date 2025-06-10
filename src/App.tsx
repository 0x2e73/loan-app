import React, { useState } from 'react';
import { User, Material, Loan, ActiveTab } from './types';
import UserManagement from './components/UserManagement';
import MaterialManagement from './components/MaterialManagement';
import LoanManagement from './components/LoanManagement';
import LoanHistory from './components/LoanHistory';
import { Users, Package, ArrowRightLeft, History, Database } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('users');
  
  // État de l'application
  const [users, setUsers] = useState<User[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  // Génération d'ID unique simple
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Gestion des utilisateurs
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date()
    };
    setUsers(prev => [...prev, newUser]);
  };

  // Gestion des matériels
  const addMaterial = (materialData: Omit<Material, 'id' | 'createdAt'>) => {
    const newMaterial: Material = {
      ...materialData,
      id: generateId(),
      createdAt: new Date()
    };
    setMaterials(prev => [...prev, newMaterial]);
  };

  // Gestion des emprunts
  const addLoan = (loanData: Omit<Loan, 'id' | 'status'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: generateId(),
      status: 'active'
    };
    setLoans(prev => [...prev, newLoan]);
  };

  const returnMaterial = (loanId: string) => {
    setLoans(prev => prev.map(loan => 
      loan.id === loanId 
        ? { ...loan, status: 'returned' as const, actualReturnDate: new Date() }
        : loan
    ));
  };

  // Fonction d'export/import des données
  const exportData = () => {
    const data = { users, materials, loans };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gestion_materiel_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.users) setUsers(data.users);
        if (data.materials) setMaterials(data.materials);
        if (data.loans) setLoans(data.loans);
        alert('Données importées avec succès !');
      } catch (error) {
        alert('Erreur lors de l\'importation des données');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const tabs = [
    { id: 'users' as const, label: 'Utilisateurs', icon: Users, count: users.length },
    { id: 'materials' as const, label: 'Matériels', icon: Package, count: materials.length },
    { id: 'loans' as const, label: 'Emprunts', icon: ArrowRightLeft, count: loans.filter(l => l.status === 'active').length },
    { id: 'history' as const, label: 'Historique', icon: History, count: loans.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Gestion des Prêts de Matériel</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={exportData}
                className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Database className="w-4 h-4" />
                Exporter
              </button>
              <label className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm cursor-pointer">
                <Database className="w-4 h-4" />
                Importer
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'users' && (
          <UserManagement users={users} onAddUser={addUser} />
        )}
        
        {activeTab === 'materials' && (
          <MaterialManagement 
            materials={materials} 
            loans={loans}
            onAddMaterial={addMaterial} 
          />
        )}
        
        {activeTab === 'loans' && (
          <LoanManagement
            users={users}
            materials={materials}
            loans={loans}
            onAddLoan={addLoan}
            onReturnMaterial={returnMaterial}
          />
        )}
        
        {activeTab === 'history' && (
          <LoanHistory
            users={users}
            materials={materials}
            loans={loans}
          />
        )}
      </main>
    </div>
  );
}

export default App;