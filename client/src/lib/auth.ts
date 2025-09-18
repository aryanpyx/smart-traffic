import { apiRequest } from './queryClient';

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface AuthResponse {
  user: User;
}

export const authService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest('POST', '/api/auth/login', { username, password });
    return response.json();
  },

  async register(username: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest('POST', '/api/auth/register', { username, password });
    return response.json();
  },
  
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  logout(): void {
    localStorage.removeItem('currentUser');
  },
  
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
};
