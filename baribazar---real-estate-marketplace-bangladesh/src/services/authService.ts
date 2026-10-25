import { User } from '../types';

const USER_STORAGE_KEY = 'baribazar_current_user';
const USERS_LIST_STORAGE_KEY = 'baribazar_all_users';

export const DEMO_USERS: User[] = [
  {
    id: 'user-seller-01',
    name: 'Morshed Masud',
    email: 'morshed@baribazar.com',
    phone: '+8801711223344',
    role: 'agent',
    companyName: 'BariBazar Premier Properties',
    savedPropertyIds: ['bb-102', 'bb-103'],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-buyer-02',
    name: 'Tanvir Hasan',
    email: 'tanvir@gmail.com',
    phone: '+8801819556677',
    role: 'user',
    savedPropertyIds: ['bb-101', 'bb-105', 'bb-106'],
    createdAt: '2024-06-20T12:00:00Z',
  },
  {
    id: 'user-admin-03',
    name: 'BariBazar Super Admin',
    email: 'admin@baribazar.com',
    phone: '+8801912334455',
    role: 'admin',
    savedPropertyIds: [],
    createdAt: '2023-11-01T08:00:00Z',
  },
];

function initUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_LIST_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_USERS;
  }
}

export const authService = {
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
      return null;
    } catch {
      return null;
    }
  },

  getAllUsers(): User[] {
    return initUsers();
  },

  login(email: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = initUsers();
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase().trim()
        );
        if (found) {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(found));
          window.dispatchEvent(new Event('baribazar_auth_change'));
          resolve(found);
        } else {
          // If not found in list, auto-register as regular user
          const newUser: User = {
            id: `user-${Date.now()}`,
            name: email.split('@')[0],
            email: email.trim(),
            phone: '+8801700000000',
            role: 'user',
            savedPropertyIds: [],
            createdAt: new Date().toISOString(),
          };
          users.push(newUser);
          localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(users));
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
          window.dispatchEvent(new Event('baribazar_auth_change'));
          resolve(newUser);
        }
      }, 300);
    });
  },

  loginAsDemo(userId: string): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = initUsers();
        const user = users.find((u) => u.id === userId) || DEMO_USERS[0];
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        window.dispatchEvent(new Event('baribazar_auth_change'));
        resolve(user);
      }, 150);
    });
  },

  register(userData: {
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'agent';
    companyName?: string;
  }): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = initUsers();
        const existing = users.find(
          (u) => u.email.toLowerCase() === userData.email.toLowerCase().trim()
        );
        if (existing) {
          reject(new Error('This email is already registered'));
          return;
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          name: userData.name,
          email: userData.email.trim(),
          phone: userData.phone.trim(),
          role: userData.role,
          companyName: userData.companyName,
          savedPropertyIds: [],
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(users));
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        window.dispatchEvent(new Event('baribazar_auth_change'));
        resolve(newUser);
      }, 300);
    });
  },

  logout(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
    window.dispatchEvent(new Event('baribazar_auth_change'));
  },

  updateSavedProperties(propertyId: string): string[] {
    const user = this.getCurrentUser();
    if (!user) return [];

    let updatedSaved = [...user.savedPropertyIds];
    if (updatedSaved.includes(propertyId)) {
      updatedSaved = updatedSaved.filter((id) => id !== propertyId);
    } else {
      updatedSaved.push(propertyId);
    }

    user.savedPropertyIds = updatedSaved;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    // Update in all users
    const allUsers = initUsers();
    const idx = allUsers.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      allUsers[idx].savedPropertyIds = updatedSaved;
      localStorage.setItem(USERS_LIST_STORAGE_KEY, JSON.stringify(allUsers));
    }

    window.dispatchEvent(new Event('baribazar_favorites_change'));
    return updatedSaved;
  },
};
