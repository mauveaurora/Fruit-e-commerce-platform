import { defineStore } from 'pinia';
import type { UserInfo } from '@/types';
import { fetchProfile, login, register } from '@/api/auth';

interface AuthState {
  token: string;
  user: UserInfo | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || '',
    user: null
  }),
  actions: {
    async login(payload: { account: string; password: string }) {
      const result = await login(payload);
      this.token = result.token;
      this.user = result.user;
      localStorage.setItem('token', result.token);
    },
    async register(payload: { username: string; phone: string; password: string }) {
      const result = await register(payload);
      this.token = result.token;
      this.user = result.user;
      localStorage.setItem('token', result.token);
    },
    async fetchProfile() {
      if (!this.token) {
        this.user = null;
        return null;
      }
      const profile = await fetchProfile();
      this.user = profile;
      return profile;
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
    }
  }
});
