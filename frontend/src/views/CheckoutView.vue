<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createOrder, previewOrder } from '@/api/orders';
import { fetchAddresses } from '@/api/user';
import { useCartStore } from '@/stores/cart';
import type { AddressItem } from '@/types';

const router = useRouter();
const cartStore = useCartStore();

const loading = ref(false);
const submitting = ref(false);
const error = ref('');

const preview = ref<{
  items: Array<{
    cartItemId: number;
    productId: number;
    productName: string;
    coverImage: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }>;
  totalAmount: number;
  payAmount: number;
} | null>(null);

const addresses = ref<AddressItem[]>([]);
const selectedAddressId = ref<number | null>(null);

async function loadData() {
  loading.value = true;
  error.value = '';
  try {
    const [previewRes, addressRes] = await Promise.all([
      previewOrder({}),
      fetchAddresses()
    ]);
    preview.value = previewRes;
    addresses.value = addressRes;

    const defaultAddress = addressRes.find((item) => item.isDefault);
    selectedAddressId.value = defaultAddress?.id || addressRes[0]?.id || null;
  } catch (e: any) {
    error.value = e.message || '加载结算信息失败';
  } finally {
    loading.value = false;
  }
}

async function submitOrder() {
  if (!selectedAddressId.value) {
    window.alert('请选择收货地址');
    return;
  }
  submitting.value = true;
  try {
    const result = await createOrder({ addressId: selectedAddressId.value });
    await cartStore.refreshCount();
    window.alert(`下单成功，订单号：${result.orderNo}`);
    router.push('/profile');
  } catch (e: any) {
    window.alert(e.message || '下单失败');
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <section class="card">
    <h2 class="section-title">确认订单</h2>

    <p v-if="loading">正在加载结算信息...</p>
    <p v-if="error" class="alert">{{ error }}</p>

    <template v-if="!loading && preview">
      <h3>收货地址</h3>
      <p v-if="!addresses.length">
        还没有收货地址，请先前往
        <RouterLink to="/profile" style="color: #3f7322">个人中心</RouterLink>
        新增地址。
      </p>
      <div class="address-list" v-else>
        <label class="address-item" v-for="item in addresses" :key="item.id">
          <input type="radio" v-model="selectedAddressId" :value="item.id" />
          <div class="address-info">
            <div class="address-meta">
              <span class="address-name">{{ item.receiver }}</span>
              <span class="address-phone">{{ item.phone }}</span>
              <span v-if="item.isDefault" class="address-default">默认</span>
            </div>
            <div class="address-detail">{{ item.province }}{{ item.city }}{{ item.detailAddress }}</div>
          </div>
        </label>
      </div>

      <h3 style="margin-top: 16px">商品清单</h3>
      <table class="table">
        <thead>
          <tr>
            <th>商品</th>
            <th>单价</th>
            <th>数量</th>
            <th>小计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in preview.items" :key="item.cartItemId">
            <td>{{ item.productName }}</td>
            <td class="price">￥{{ Number(item.unitPrice).toFixed(2) }}</td>
            <td>{{ item.quantity }}</td>
            <td class="price">￥{{ Number(item.subtotal).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="summary-row">
        <div>应付金额：<span class="price">￥{{ Number(preview.payAmount).toFixed(2) }}</span></div>
        <button class="solid-btn" :disabled="submitting || !addresses.length" @click="submitOrder">
          {{ submitting ? '提交中...' : '提交订单' }}
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 8px;
}

.address-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid #d9e4cd;
  border-radius: 10px;
  line-height: 1.4;
}

.address-item input {
  margin-top: 2px;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
}

.address-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.address-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.address-phone {
  font-weight: 500;
  color: #5b6b57;
}

.address-detail {
  color: #556559;
  word-break: break-all;
}

.address-default {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 999px;
  background: #eef6e7;
  color: #3f7322;
}

.summary-row {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
