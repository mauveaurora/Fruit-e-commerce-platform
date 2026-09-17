import request from './http';
import type { UserInfo } from '@/types';

export function register(payload: { username: string; phone: string; password: string }) {
  return request.post('/auth/register', payload) as Promise<{ token: string; user: UserInfo }>;
}

export function login(payload: { account: string; password: string }) {
  return request.post('/auth/login', payload) as Promise<{ token: string; user: UserInfo }>;
}

export function fetchProfile() {
  return request.get('/auth/profile') as Promise<UserInfo>;
}
