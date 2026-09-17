<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { fetchProfile } from '@/api/auth';
import { cancelOrder, fetchOrders } from '@/api/orders';
import {
  addAddress,
  deleteAddress,
  fetchAddresses,
  fetchFavorites,
  removeFavorite
} from '@/api/user';
import type { AddressItem, FavoriteItem, OrderSummary, UserInfo } from '@/types';

const loading = ref(false);
const profile = ref<UserInfo | null>(null);
const orders = ref<OrderSummary[]>([]);
const addresses = ref<AddressItem[]>([]);
const favorites = ref<FavoriteItem[]>([]);

const addressForm = reactive({
  receiver: '',
  phone: '',
  province: '',
  city: '',
  detailAddress: '',
  isDefault: false
});

async function loadAll() {
  loading.value = true;
  try {
    const [profileRes, ordersRes, addressRes, favoriteRes] = await Promise.all([
      fetchProfile(),
      fetchOrders(),
      fetchAddresses(),
      fetchFavorites()
    ]);
    profile.value = profileRes;
    orders.value = ordersRes;
    addresses.value = addressRes;
    favorites.value = favoriteRes;
  } catch (e: any) {
    window.alert(e.message || '加载个人中心失败');
  } finally {
    loading.value = false;
  }
}

async function submitAddress() {
  try {
    await addAddress(addressForm);
    Object.assign(addressForm, {
      receiver: '',
      phone: '',
      province: '',
      city: '',
      detailAddress: '',
      isDefault: false
    });
    addresses.value = await fetchAddresses();
  } catch (e: any) {
    window.alert(e.message || '新增地址失败');
  }
}

async function removeAddress(id: number) {
  if (!window.confirm('确定删除该地址吗？')) {
    return;
  }
  try {
    await deleteAddress(id);
    addresses.value = await fetchAddresses();
  } catch (e: any) {
    window.alert(e.message || '删除地址失败');
  }
}

async function doCancelOrder(id: number) {
  if (!window.confirm('确认取消该订单？')) {
    return;
  }
  try {
    await cancelOrder(id);
    orders.value = await fetchOrders();
  } catch (e: any) {
    window.alert(e.message || '取消订单失败');
  }
}

async function removeFav(productId: number) {
  try {
    await removeFavorite(productId);
    favorites.value = await fetchFavorites();
  } catch (e: any) {
    window.alert(e.message || '取消收藏失败');
  }
}

onMounted(() => {
  loadAll();
});
</script>

<template>
  <p v-if="loading">正在加载个人中心...</p>

  <section class="card" v-if="profile">
    <h2 class="section-title">个人信息</h2>
    <p>用户名：{{ profile.username }}</p>
    <p>手机号：{{ profile.phone }}</p>
    <p>账号状态：{{ profile.status }}</p>
  </section>

  <section class="card" style="margin-top: 14px">
    <h2 class="section-title">我的订单</h2>
    <table class="table" v-if="orders.length">
      <thead>
        <tr>
          <th>订单号</th>
          <th>金额</th>
          <th>状态</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.orderNo }}</td>
          <td class="price">￥{{ Number(order.payAmount).toFixed(2) }}</td>
          <td>{{ order.orderStatus }}</td>
          <td>{{ order.createdAt }}</td>
          <td>
            <button
              class="ghost-btn"
              @click="doCancelOrder(order.id)"
              :disabled="order.orderStatus !== 'CREATED'"
            >
              取消订单
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>暂无订单。</p>
  </section>

  <section class="card" style="margin-top: 14px">
    <h2 class="section-title">收货地址</h2>
    <div class="form-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr)); margin-bottom: 10px">
      <input v-model="addressForm.receiver" placeholder="收货人" />
      <input v-model="addressForm.phone" placeholder="手机号" />
      <input v-model="addressForm.province" placeholder="省份" />
      <input v-model="addressForm.city" placeholder="城市" />
      <input v-model="addressForm.detailAddress" placeholder="详细地址" />
      <label style="display: flex; align-items: center; gap: 6px">
        <input type="checkbox" v-model="addressForm.isDefault" style="width: auto" /> 设为默认
      </label>
    </div>
    <button class="solid-btn" @click="submitAddress">新增地址</button>

    <ul class="simple-list" v-if="addresses.length">
      <li v-for="item in addresses" :key="item.id">
        {{ item.receiver }} {{ item.phone }} {{ item.province }}{{ item.city }}{{ item.detailAddress }}
        <strong v-if="item.isDefault">（默认）</strong>
        <button class="ghost-btn" @click="removeAddress(item.id)">删除</button>
      </li>
    </ul>
  </section>

  <section class="card" style="margin-top: 14px">
    <h2 class="section-title">我的收藏</h2>
    <div class="grid products" v-if="favorites.length">
      <article class="card" v-for="item in favorites" :key="item.favoriteId">
        <img :src="item.coverImage" :alt="item.name" style="width: 100%; border-radius: 10px; aspect-ratio: 4/3; object-fit: cover" />
        <h4>{{ item.name }}</h4>
        <p class="price">￥{{ Number(item.price).toFixed(2) }}</p>
        <button class="ghost-btn" @click="removeFav(item.productId)">取消收藏</button>
      </article>
    </div>
    <p v-else>暂无收藏商品。</p>
  </section>
</template>

<style scoped>
.simple-list {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: grid;
  gap: 8px;
}

.simple-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #deead1;
  border-radius: 10px;
  padding: 8px 10px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr !important;
  }

  .simple-list li {
    flex-wrap: wrap;
  }
}
</style>
