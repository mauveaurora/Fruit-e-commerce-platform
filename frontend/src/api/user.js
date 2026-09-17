import request from './http';
export function fetchAddresses() {
    return request.get('/user/addresses');
}
export function addAddress(payload) {
    return request.post('/user/addresses', payload);
}
export function updateAddress(id, payload) {
    return request.put(`/user/addresses/${id}`, payload);
}
export function deleteAddress(id) {
    return request.delete(`/user/addresses/${id}`);
}
export function fetchFavorites() {
    return request.get('/user/favorites');
}
export function addFavorite(productId) {
    return request.post(`/user/favorites/${productId}`);
}
export function removeFavorite(productId) {
    return request.delete(`/user/favorites/${productId}`);
}
