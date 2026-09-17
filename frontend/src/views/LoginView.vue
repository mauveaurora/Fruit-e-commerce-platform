<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';

const authStore = useAuthStore();
const cartStore = useCartStore();
const route = useRoute();
const router = useRouter();

const form = reactive({
  account: 'demo',
  password: '123456'
});

const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    await authStore.login(form);
    await cartStore.refreshCount();
    const redirect = (route.query.redirect as string) || '/';
    router.push(redirect);
  } catch (e: any) {
    error.value = e.message || '登录失败';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="auth card">
    <h2>账号登录</h2>
    <p class="hint">演示账号：demo / 123456</p>
    <div class="form-grid">
      <input v-model="form.account" placeholder="用户名或手机号" />
      <input v-model="form.password" type="password" placeholder="密码" />
      <button class="solid-btn" :disabled="loading" @click="submit">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <p class="alert" v-if="error">{{ error }}</p>
      <p>
        还没有账号？
        <RouterLink to="/register" style="color: #3f7322">去注册</RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.auth {
  max-width: 420px;
  margin: 30px auto;
}

.hint {
  color: #6b765d;
  margin-bottom: 12px;
}
</style>
