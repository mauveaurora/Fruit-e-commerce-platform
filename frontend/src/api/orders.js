import request from './http';
export function previewOrder(payload) {
    return request.post('/orders/preview', payload);
}
export function createOrder(payload) {
    return request.post('/orders', payload);
}
export function fetchOrders() {
    return request.get('/orders');
}
export function fetchOrderDetail(id) {
    return request.get(`/orders/${id}`);
}
export function cancelOrder(id) {
    return request.post(`/orders/${id}/cancel`);
}
