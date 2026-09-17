import request from './http';
export function fetchCartItems() {
    return request.get('/cart/items');
}
export function addCartItem(payload) {
    return request.post('/cart/items', payload);
}
export function updateCartItem(id, payload) {
    return request.put(`/cart/items/${id}`, payload);
}
export function removeCartItem(id) {
    return request.delete(`/cart/items/${id}`);
}
