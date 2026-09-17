<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const isLoggedIn = computed(() => Boolean(authStore.token));

async function initUserState() {
  if (isLoggedIn.value) {
    try {
      await authStore.fetchProfile();
      await cartStore.refreshCount();
    } catch {
      authStore.logout();
    }
  }
}

function logout() {
  authStore.logout();
  cartStore.count = 0;
  router.push('/');
}

onMounted(() => {
  initUserState();
});
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="topbar-inner">
        <RouterLink class="brand" to="/">鲜果电商</RouterLink>
        <nav class="nav-links">
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/products">商品</RouterLink>
          <RouterLink to="/cart">购物车({{ cartStore.count }})</RouterLink>
          <RouterLink to="/profile">个人中心</RouterLink>
        </nav>
        <div class="auth-area">
          <template v-if="isLoggedIn">
            <span class="username">你好，{{ authStore.user?.username || '用户' }}</span>
            <button class="ghost-btn" @click="logout">退出</button>
          </template>
          <template v-else>
            <RouterLink class="ghost-btn" to="/login">登录</RouterLink>
            <RouterLink class="solid-btn" to="/register">注册</RouterLink>
          </template>
        </div>
      </div>
    </header>

    <main class="page-wrap">
      <RouterView />
    </main>
  </div>
</template>
