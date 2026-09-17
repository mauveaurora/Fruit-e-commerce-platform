<script setup lang="ts">
import type { ProductItem } from '@/types';

defineProps<{
  product: ProductItem;
}>();

const emit = defineEmits<{
  (event: 'add', productId: number): void;
}>();
</script>

<template>
  <article class="product-card card">
    <img :src="product.coverImage" :alt="product.name" class="cover" loading="lazy" />
    <h3 class="name">{{ product.name }}</h3>
    <p class="meta">{{ product.category }} · {{ product.originPlace }}</p>
    <p class="price">￥{{ Number(product.price).toFixed(2) }}</p>
    <div class="action-row">
      <RouterLink class="ghost-btn" :to="`/products/${product.id}`">查看详情</RouterLink>
      <button class="solid-btn" @click="emit('add', product.id)">加入购物车</button>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cover {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 10px;
}

.name {
  margin: 4px 0 0;
  font-size: 18px;
}

.meta {
  margin: 0;
  color: #6f7a62;
  font-size: 13px;
}

.action-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.action-row .ghost-btn,
.action-row .solid-btn {
  flex: 1;
  text-align: center;
}
</style>
