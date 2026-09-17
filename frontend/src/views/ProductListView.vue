<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import type { ProductItem } from '@/types';
import { fetchProducts } from '@/api/products';
import { addCartItem } from '@/api/cart';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const keyword = ref('');
const category = ref('');
const origin = ref('');
const sort = ref('newest');
const page = ref(0);
const size = 8;

const loading = ref(false);
const error = ref('');
const products = ref<ProductItem[]>([]);
const totalPages = ref(1);

function queryValueOf(value: unknown) {
  if (Array.isArray(value)) {
    return value[0] || '';
  }
  return typeof value === 'string' ? value : '';
}

function applyRouteQuery() {
  keyword.value = queryValueOf(route.query.keyword);
  category.value = queryValueOf(route.query.category);
  origin.value = queryValueOf(route.query.origin);

  const routeSort = queryValueOf(route.query.sort);
  if (["newest", "priceAsc", "priceDesc", "salesDesc"].includes(routeSort)) {
    sort.value = routeSort;
  } else {
    sort.value = 'newest';
  }
}

function buildSearchQuery() {
  return {
    keyword: keyword.value || undefined,
    category: category.value || undefined,
    origin: origin.value || undefined,
    sort: sort.value === 'newest' ? undefined : sort.value
  };
}

async function loadProducts() {
  loading.value = true;
  error.value = '';
  try {
    const result = await fetchProducts({
      keyword: keyword.value || undefined,
      category: category.value || undefined,
      origin: origin.value || undefined,
      sort: sort.value,
      page: page.value,
      size
    });
    products.value = result.records;
    totalPages.value = Math.max(1, result.totalPages);
  } catch (e: any) {
    error.value = e.message || '加载商品失败';
  } finally {
    loading.value = false;
  }
}

function search() {
  page.value = 0;
  router.replace({ query: buildSearchQuery() });
  loadProducts();
}

function prevPage() {
  if (page.value <= 0) {
    return;
  }
  page.value -= 1;
  loadProducts();
}

function nextPage() {
  if (page.value >= totalPages.value - 1) {
    return;
  }
  page.value += 1;
  loadProducts();
}

async function handleAdd(productId: number) {
  if (!localStorage.getItem('token')) {
    router.push('/login');
    return;
  }

  try {
    await addCartItem({ productId, quantity: 1 });
    await cartStore.refreshCount();
    window.alert('已加入购物车');
  } catch (e: any) {
    window.alert(e.message || '加入购物车失败');
  }
}

onMounted(() => {
  applyRouteQuery();
  loadProducts();
});
</script>

<template>
  <section class="card">
    <h2 class="section-title">水果商品列表</h2>
    <div class="filter-grid">
      <input v-model="keyword" placeholder="搜索水果名称" />
      <select v-model="category">
        <option value="">全部品类</option>
        <option value="浆果">浆果</option>
        <option value="仁果">仁果</option>
        <option value="热带">热带</option>
        <option value="柑橘">柑橘</option>
      </select>
      <input v-model="origin" placeholder="产地，如 云南" />
      <select v-model="sort">
        <option value="newest">最新上架</option>
        <option value="priceAsc">价格从低到高</option>
        <option value="priceDesc">价格从高到低</option>
        <option value="salesDesc">销量优先</option>
      </select>
      <button class="solid-btn" @click="search">筛选</button>
    </div>
  </section>

  <p v-if="loading">正在加载商品...</p>
  <p v-if="error" class="alert">{{ error }}</p>

  <div class="grid products" v-if="!loading && products.length">
    <ProductCard v-for="item in products" :key="item.id" :product="item" @add="handleAdd" />
  </div>

  <div class="pager">
    <button class="ghost-btn" @click="prevPage" :disabled="page === 0">上一页</button>
    <span>第 {{ page + 1 }} / {{ totalPages }} 页</span>
    <button class="ghost-btn" @click="nextPage" :disabled="page >= totalPages - 1">下一页</button>
  </div>
</template>

<style scoped>
.filter-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr auto;
  gap: 10px;
}

.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 992px) {
  .filter-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
