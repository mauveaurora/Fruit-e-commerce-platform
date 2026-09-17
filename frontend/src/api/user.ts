import request from './http';
import type { AddressItem, FavoriteItem } from '@/types';

export function fetchAddresses() {
  return request.get('/user/addresses') as Promise<AddressItem[]>;
}

export function addAddress(payload: {
  receiver: string;
  phone: string;
  province: string;
  city: string;
  detailAddress: string;
  isDefault?: boolean;
}) {
  return request.post('/user/addresses', payload) as Promise<AddressItem>;
}

export function updateAddress(
  id: number,
  payload: {
    receiver: string;
    phone: string;
    province: string;
    city: string;
    detailAddress: string;
    isDefault?: boolean;
  }
) {
  return request.put(`/user/addresses/${id}`, payload) as Promise<AddressItem>;
}

export function deleteAddress(id: number) {
  return request.delete(`/user/addresses/${id}`) as Promise<void>;
}

export function fetchFavorites() {
  return request.get('/user/favorites') as Promise<FavoriteItem[]>;
}

export function addFavorite(productId: number) {
  return request.post(`/user/favorites/${productId}`) as Promise<void>;
}

export function removeFavorite(productId: number) {
  return request.delete(`/user/favorites/${productId}`) as Promise<void>;
}
