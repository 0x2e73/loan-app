export interface User {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  createdAt: Date;
}

export interface Loan {
  id: string;
  userId: string;
  materialId: string;
  borrowDate: Date;
  expectedReturnDate?: Date; // Maintenant optionnel
  actualReturnDate?: Date;
  status: 'active' | 'returned';
}

export type ActiveTab = 'users' | 'materials' | 'loans' | 'history';