<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { fetchProducts, fetchRecommendProducts } from '@/api/products';
import { addCartItem } from '@/api/cart';
import { useCartStore } from '@/stores/cart';
import type { ProductItem } from '@/types';

const router = useRouter();
const cartStore = useCartStore();

const quickKeyword = ref('');
const loading = ref(false);
const error = ref('');
const recommendProducts = ref<ProductItem[]>([]);
const newArrivalProducts = ref<ProductItem[]>([]);
const bestSellerProducts = ref<ProductItem[]>([]);

const categoryShortcuts = [
  { label: '浆果专区', value: '浆果', note: '蓝莓、草莓、车厘子等小果风味' },
  { label: '仁果专区', value: '仁果', note: '苹果、梨等清脆多汁，适合全家' },
  { label: '热带专区', value: '热带', note: '凤梨、芒果、火龙果等热带香甜' },
  { label: '柑橘专区', value: '柑橘', note: '橙子、柚子等高维C酸甜口感' }
];

const serviceHighlights = [
  { title: '产地直采', desc: '合作果园源头发货，减少中转更鲜活' },
  { title: '冷链配送', desc: '冷藏仓配覆盖主流城市，控温到家' },
  { title: '售后无忧', desc: '坏果包赔，支持在线快速处理' }
];

const spotlightStats = computed(() => {
  const merged = [...recommendProducts.value, ...newArrivalProducts.value, ...bestSellerProducts.value];
  const uniqueIds = new Set<number>();
  const categories = new Set<string>();
  let seasonalCount = 0;

  for (const product of merged) {
    uniqueIds.add(product.id);
    categories.add(product.category);
    if (product.seasonal) {
      seasonalCount += 1;
    }
  }

  return [
    { label: '首页精选', value: `${uniqueIds.size}款` },
    { label: '覆盖品类', value: `${categories.size}类` },
    { label: '应季好果', value: `${seasonalCount}款` }
  ];
});

async function loadHomeData() {
  loading.value = true;
  error.value = '';
  try {
    const [recommendResult, newestResult, salesResult] = await Promise.all([
      fetchRecommendProducts(),
      fetchProducts({ sort: 'newest', page: 0, size: 8 }),
      fetchProducts({ sort: 'salesDesc', page: 0, size: 5 })
    ]);

    recommendProducts.value = recommendResult;
    newArrivalProducts.value = newestResult.records;
    bestSellerProducts.value = salesResult.records;
  } catch (e: any) {
    error.value = e.message || '加载首页数据失败';
  } finally {
    loading.value = false;
  }
}

function goToProductList(query: Record<string, string>) {
  router.push({
    path: '/products',
    query
  });
}

function handleQuickSearch() {
  const keyword = quickKeyword.value.trim();
  if (!keyword) {
    goToProductList({});
    return;
  }
  goToProductList({ keyword });
}

function goToCategory(category: string) {
  goToProductList({ category });
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
  loadHomeData();
});
</script>

<template>
  <section class="home-hero card">
    <div class="hero-main">
      <h1>每日鲜果直达，产地直采更安心</h1>
      <p>精选当季水果，支持快速下单、物流追踪、售后无忧。</p>

      <div class="hero-search">
        <input
          v-model="quickKeyword"
          placeholder="搜索水果名称，如 蓝莓 / 凤梨"
          @keyup.enter="handleQuickSearch"
        />
        <button class="solid-btn" @click="handleQuickSearch">搜索水果</button>
      </div>

      <div class="hero-actions">
        <RouterLink class="solid-btn" to="/products">立即选购</RouterLink>
        <RouterLink class="ghost-btn" to="/profile">进入个人中心</RouterLink>
      </div>
    </div>

    <ul class="hero-stats">
      <li class="hero-stat" v-for="item in spotlightStats" :key="item.label">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </section>

  <section class="service-grid">
    <article class="card service-card" v-for="item in serviceHighlights" :key="item.title">
      <h3>{{ item.title }}</h3>
      <p>{{ item.desc }}</p>
    </article>
  </section>

  <section>
    <div class="section-head">
      <h2 class="section-title">分类直达</h2>
      <RouterLink class="ghost-btn" to="/products">查看全部</RouterLink>
    </div>
    <div class="shortcut-grid">
      <button
        class="card shortcut-card"
        v-for="item in categoryShortcuts"
        :key="item.value"
        @click="goToCategory(item.value)"
      >
        <h3>{{ item.label }}</h3>
        <p>{{ item.note }}</p>
      </button>
    </div>
  </section>

  <section>
    <h2 class="section-title">热门推荐</h2>
    <p v-if="loading">正在加载首页数据...</p>
    <p v-if="error" class="alert">{{ error }}</p>
    <div class="grid products" v-if="!loading && recommendProducts.length">
      <ProductCard v-for="item in recommendProducts" :key="item.id" :product="item" @add="handleAdd" />
    </div>
  </section>

  <section>
    <div class="section-head">
      <h2 class="section-title">新鲜上架</h2>
      <button class="ghost-btn" @click="goToProductList({ sort: 'newest' })">查看更多</button>
    </div>
    <div class="grid products" v-if="!loading && newArrivalProducts.length">
      <ProductCard v-for="item in newArrivalProducts" :key="item.id" :product="item" @add="handleAdd" />
    </div>
  </section>

  <section class="card rank-board" v-if="!loading && bestSellerProducts.length">
    <div class="section-head">
      <h2 class="section-title">本周销量榜</h2>
      <button class="ghost-btn" @click="goToProductList({ sort: 'salesDesc' })">按销量选购</button>
    </div>
    <ol>
      <li v-for="(item, index) in bestSellerProducts" :key="item.id">
        <span class="rank-tag">TOP {{ index + 1 }}</span>
        <div class="rank-main">
          <RouterLink :to="`/products/${item.id}`">{{ item.name }}</RouterLink>
          <small>{{ item.category }} · {{ item.originPlace }}</small>
        </div>
        <span class="price">￥{{ Number(item.price).toFixed(2) }}</span>
        <button class="solid-btn" @click="handleAdd(item.id)">加入购物车</button>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.home-hero {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-top: 8px;
  margin-bottom: 16px;
  background:
    linear-gradient(115deg, rgba(117, 176, 74, 0.18), rgba(255, 183, 94, 0.12)),
    #fdfef9;
}

.hero-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

h1 {
  margin: 0 0 10px;
  font-size: 34px;
}

p {
  color: #5d6652;
  margin: 0;
}

.hero-search {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

.hero-actions {
  display: flex;
  gap: 10px;
}

.hero-stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.hero-stat {
  border: 1px solid rgba(94, 128, 64, 0.18);
  background: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-stat strong {
  font-size: 24px;
  color: #34571f;
}

.hero-stat span {
  font-size: 13px;
  color: #6e7a63;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.service-card {
  min-height: 118px;
}

.service-card h3 {
  margin: 0 0 8px;
  color: #2f5819;
}

.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.shortcut-card {
  text-align: left;
  border: 1px solid #dce6d1;
  background: #ffffff;
}

.shortcut-card h3 {
  margin: 0 0 6px;
}

.shortcut-card p {
  color: #6c7761;
  font-size: 13px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.rank-board {
  margin-top: 20px;
}

.rank-board ol {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.rank-board li {
  border: 1px solid #deead3;
  border-radius: 10px;
  padding: 10px;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 10px;
}

.rank-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0d8;
  color: #9a580f;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
}

.rank-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rank-main a {
  font-weight: 700;
}

.rank-main small {
  color: #6c7761;
}

@media (max-width: 992px) {
  .home-hero {
    grid-template-columns: 1fr;
  }

  .service-grid {
    grid-template-columns: 1fr;
  }

  .shortcut-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .rank-board li {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .hero-search {
    grid-template-columns: 1fr;
  }

  .hero-actions {
    flex-wrap: wrap;
  }

  .shortcut-grid {
    grid-template-columns: 1fr;
  }
}
</style>
