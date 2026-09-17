import request from './http';
export function fetchProducts(params) {
    return request.get('/products', { params });
}
export function fetchProductDetail(id) {
    return request.get(`/products/${id}`);
}
export function fetchRecommendProducts() {
    return request.get('/products/recommend');
}
