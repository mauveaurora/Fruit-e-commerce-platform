import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/products', name: 'products', component: () => import('@/views/ProductListView.vue') },
    { path: '/products/:id', name: 'product-detail', component: () => import('@/views/ProductDetailView.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue') },
    { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue'), meta: { requiresAuth: true } },
    { path: '/checkout', name: 'checkout', component: () => import('@/views/CheckoutView.vue'), meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { requiresAuth: true } }
  ]
});

router.beforeEach((to) => {
  const hasToken = Boolean(localStorage.getItem('token'));
  if (to.meta.requiresAuth && !hasToken) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    };
  }
  return true;
});

export default router;
