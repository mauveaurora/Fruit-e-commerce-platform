<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchProductDetail } from '@/api/products';
import { addCartItem } from '@/api/cart';
import { addFavorite } from '@/api/user';
import { useCartStore } from '@/stores/cart';
import type { ProductItem } from '@/types';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref<ProductItem | null>(null);
const quantity = ref(1);
const loading = ref(false);
const error = ref('');

async function loadDetail() {
  const id = Number(route.params.id);
  if (!id) {
    error.value = '商品ID无效';
    return;
  }

  loading.value = true;
  error.value = '';
  try {
    product.value = await fetchProductDetail(id);
  } catch (e: any) {
    error.value = e.message || '加载商品详情失败';
  } finally {
    loading.value = false;
  }
}

async function addToCart() {
  if (!product.value) {
    return;
  }
  if (!localStorage.getItem('token')) {
    router.push('/login');
    return;
  }

  try {
    await addCartItem({ productId: product.value.id, quantity: quantity.value });
    await cartStore.refreshCount();
    window.alert('加入购物车成功');
  } catch (e: any) {
    window.alert(e.message || '加入购物车失败');
  }
}

async function collect() {
  if (!product.value) {
    return;
  }
  if (!localStorage.getItem('token')) {
    router.push('/login');
    return;
  }

  try {
    await addFavorite(product.value.id);
    window.alert('已加入收藏');
  } catch (e: any) {
    window.alert(e.message || '收藏失败');
  }
}

onMounted(() => {
  loadDetail();
});
</script>

<template>
  <p v-if="loading">正在加载详情...</p>
  <p v-if="error" class="alert">{{ error }}</p>

  <section v-if="product" class="detail card">
    <img :src="product.coverImage" :alt="product.name" class="cover" />
    <div>
      <h2>{{ product.name }}</h2>
      <p class="meta">{{ product.category }} · {{ product.originPlace }}</p>
      <p class="price">￥{{ Number(product.price).toFixed(2) }}</p>
      <p>库存：{{ product.stock }}</p>
      <p>营养信息：{{ product.nutritionInfo || '暂无' }}</p>
      <p>商品介绍：{{ product.description || '暂无' }}</p>
      <div class="action-row">
        <input v-model.number="quantity" type="number" min="1" :max="product.stock" style="width: 120px" />
        <button class="solid-btn" @click="addToCart">加入购物车</button>
        <button class="ghost-btn" @click="collect">收藏</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.detail {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 18px;
}

.cover {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  aspect-ratio: 4 / 3;
}

.meta {
  color: #667356;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

@media (max-width: 768px) {
  .detail {
    grid-template-columns: 1fr;
  }
}
</style>
