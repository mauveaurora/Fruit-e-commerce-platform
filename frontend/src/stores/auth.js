import { defineStore } from 'pinia';
import { fetchProfile, login, register } from '@/api/auth';
export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: null
    }),
    actions: {
        async login(payload) {
            const result = await login(payload);
            this.token = result.token;
            this.user = result.user;
            localStorage.setItem('token', result.token);
        },
        async register(payload) {
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
