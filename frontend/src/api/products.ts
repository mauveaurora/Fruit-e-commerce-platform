import request from './http';
import type { ProductItem, ProductPage } from '@/types';

export function fetchProducts(params: Record<string, unknown>) {
  return request.get('/products', { params }) as Promise<ProductPage>;
}

export function fetchProductDetail(id: number) {
  return request.get(`/products/${id}`) as Promise<ProductItem>;
}

export function fetchRecommendProducts() {
  return request.get('/products/recommend') as Promise<ProductItem[]>;
}
