<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const form = reactive({
  username: '',
  phone: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    await authStore.register(form);
    await cartStore.refreshCount();
    router.push('/');
  } catch (e: any) {
    error.value = e.message || '注册失败';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="auth card">
    <h2>账号注册</h2>
    <div class="form-grid">
      <input v-model="form.username" placeholder="用户名" />
      <input v-model="form.phone" placeholder="手机号" />
      <input v-model="form.password" type="password" placeholder="密码（6位以上）" />
      <button class="solid-btn" :disabled="loading" @click="submit">
        {{ loading ? '注册中...' : '注册并登录' }}
      </button>
      <p class="alert" v-if="error">{{ error }}</p>
      <p>
        已有账号？
        <RouterLink to="/login" style="color: #3f7322">去登录</RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.auth {
  max-width: 420px;
  margin: 30px auto;
}
</style>
