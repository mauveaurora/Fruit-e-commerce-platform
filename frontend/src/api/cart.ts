import request from './http';
import type { CartItem } from '@/types';

export function fetchCartItems() {
  return request.get('/cart/items') as Promise<CartItem[]>;
}

export function addCartItem(payload: { productId: number; quantity: number }) {
  return request.post('/cart/items', payload) as Promise<void>;
}

export function updateCartItem(id: number, payload: { quantity: number }) {
  return request.put(`/cart/items/${id}`, payload) as Promise<void>;
}

export function removeCartItem(id: number) {
  return request.delete(`/cart/items/${id}`) as Promise<void>;
}
