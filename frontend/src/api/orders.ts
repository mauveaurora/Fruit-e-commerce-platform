import request from './http';
import type { OrderSummary } from '@/types';

export function previewOrder(payload: { cartItemIds?: number[]; addressId?: number }) {
  return request.post('/orders/preview', payload) as Promise<{
    items: Array<{
      cartItemId: number;
      productId: number;
      productName: string;
      coverImage: string;
      unitPrice: number;
      quantity: number;
      subtotal: number;
    }>;
    totalAmount: number;
    payAmount: number;
  }>;
}

export function createOrder(payload: { cartItemIds?: number[]; addressId?: number }) {
  return request.post('/orders', payload) as Promise<{ orderId: number; orderNo: string; payAmount: number }>;
}

export function fetchOrders() {
  return request.get('/orders') as Promise<OrderSummary[]>;
}

export function fetchOrderDetail(id: number) {
  return request.get(`/orders/${id}`) as Promise<Record<string, unknown>>;
}

export function cancelOrder(id: number) {
  return request.post(`/orders/${id}/cancel`) as Promise<void>;
}
