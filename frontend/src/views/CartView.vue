<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchCartItems, removeCartItem, updateCartItem } from '@/api/cart';
import { useCartStore } from '@/stores/cart';
import type { CartItem } from '@/types';

const router = useRouter();
const cartStore = useCartStore();

const loading = ref(false);
const error = ref('');
const items = ref<CartItem[]>([]);

const totalAmount = computed(() =>
  items.value.reduce((sum, item) => sum + Number(item.subtotal), 0)
);

async function loadCart() {
  loading.value = true;
  error.value = '';
  try {
    items.value = await fetchCartItems();
  } catch (e: any) {
    error.value = e.message || '加载购物车失败';
  } finally {
    loading.value = false;
  }
}

async function changeQuantity(item: CartItem, value: number) {
  try {
    const quantity = Math.max(1, Math.min(item.stock, value));
    await updateCartItem(item.id, { quantity });
    await loadCart();
    await cartStore.refreshCount();
  } catch (e: any) {
    window.alert(e.message || '更新数量失败');
  }
}

async function removeItem(id: number) {
  try {
    await removeCartItem(id);
    await loadCart();
    await cartStore.refreshCount();
  } catch (e: any) {
    window.alert(e.message || '删除失败');
  }
}

function goCheckout() {
  if (!items.value.length) {
    window.alert('购物车为空');
    return;
  }
  router.push('/checkout');
}

onMounted(() => {
  loadCart();
});
</script>

<template>
  <section class="card">
    <h2 class="section-title">我的购物车</h2>
    <p v-if="loading">正在加载购物车...</p>
    <p v-if="error" class="alert">{{ error }}</p>

    <table class="table" v-if="!loading && items.length">
      <thead>
        <tr>
          <th>商品</th>
          <th>单价</th>
          <th>数量</th>
          <th>小计</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name }}</td>
          <td class="price">￥{{ Number(item.price).toFixed(2) }}</td>
          <td>
            <input
              type="number"
              min="1"
              :max="item.stock"
              :value="item.quantity"
              style="width: 90px"
              @change="changeQuantity(item, Number(($event.target as HTMLInputElement).value))"
            />
          </td>
          <td class="price">￥{{ Number(item.subtotal).toFixed(2) }}</td>
          <td>
            <button class="ghost-btn" @click="removeItem(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!loading && !items.length">购物车是空的，去商品页挑选吧。</p>

    <div class="checkout-row" v-if="items.length">
      <div>合计：<span class="price">￥{{ totalAmount.toFixed(2) }}</span></div>
      <button class="solid-btn" @click="goCheckout">去结算</button>
    </div>
  </section>
</template>

<style scoped>
.checkout-row {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
