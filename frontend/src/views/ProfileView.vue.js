/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, reactive, ref } from 'vue';
import { fetchProfile } from '@/api/auth';
import { cancelOrder, fetchOrders } from '@/api/orders';
import { addAddress, deleteAddress, fetchAddresses, fetchFavorites, removeFavorite } from '@/api/user';
const loading = ref(false);
const profile = ref(null);
const orders = ref([]);
const addresses = ref([]);
const favorites = ref([]);
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
    }
    catch (e) {
        window.alert(e.message || '加载个人中心失败');
    }
    finally {
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
    }
    catch (e) {
        window.alert(e.message || '新增地址失败');
    }
}
async function removeAddress(id) {
    if (!window.confirm('确定删除该地址吗？')) {
        return;
    }
    try {
        await deleteAddress(id);
        addresses.value = await fetchAddresses();
    }
    catch (e) {
        window.alert(e.message || '删除地址失败');
    }
}
async function doCancelOrder(id) {
    if (!window.confirm('确认取消该订单？')) {
        return;
    }
    try {
        await cancelOrder(id);
        orders.value = await fetchOrders();
    }
    catch (e) {
        window.alert(e.message || '取消订单失败');
    }
}
async function removeFav(productId) {
    try {
        await removeFavorite(productId);
        favorites.value = await fetchFavorites();
    }
    catch (e) {
        window.alert(e.message || '取消收藏失败');
    }
}
onMounted(() => {
    loadAll();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['simple-list']} */ ;
/** @type {__VLS_StyleScopedClasses['simple-list']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
if (__VLS_ctx.profile) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
        ...{ class: "section-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.profile.username);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.profile.phone);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.profile.status);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "card" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
if (__VLS_ctx.orders.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "table" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (const [order] of __VLS_getVForSourceType((__VLS_ctx.orders))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (order.id),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (order.orderNo);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "price" },
        });
        (Number(order.payAmount).toFixed(2));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (order.orderStatus);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (order.createdAt);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.orders.length))
                        return;
                    __VLS_ctx.doCancelOrder(order.id);
                } },
            ...{ class: "ghost-btn" },
            disabled: (order.orderStatus !== 'CREATED'),
        });
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "card" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-grid" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    placeholder: "收货人",
});
(__VLS_ctx.addressForm.receiver);
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    placeholder: "手机号",
});
(__VLS_ctx.addressForm.phone);
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    placeholder: "省份",
});
(__VLS_ctx.addressForm.province);
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    placeholder: "城市",
});
(__VLS_ctx.addressForm.city);
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    placeholder: "详细地址",
});
(__VLS_ctx.addressForm.detailAddress);
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: "checkbox",
    ...{ style: {} },
});
(__VLS_ctx.addressForm.isDefault);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.submitAddress) },
    ...{ class: "solid-btn" },
});
if (__VLS_ctx.addresses.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "simple-list" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.addresses))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (item.id),
        });
        (item.receiver);
        (item.phone);
        (item.province);
        (item.city);
        (item.detailAddress);
        if (item.isDefault) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.addresses.length))
                        return;
                    __VLS_ctx.removeAddress(item.id);
                } },
            ...{ class: "ghost-btn" },
        });
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "card" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
if (__VLS_ctx.favorites.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid products" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.favorites))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)({
            ...{ class: "card" },
            key: (item.favoriteId),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (item.coverImage),
            alt: (item.name),
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
        (item.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "price" },
        });
        (Number(item.price).toFixed(2));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.favorites.length))
                        return;
                    __VLS_ctx.removeFav(item.productId);
                } },
            ...{ class: "ghost-btn" },
        });
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['table']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['solid-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['simple-list']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['products']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            profile: profile,
            orders: orders,
            addresses: addresses,
            favorites: favorites,
            addressForm: addressForm,
            submitAddress: submitAddress,
            removeAddress: removeAddress,
            doCancelOrder: doCancelOrder,
            removeFav: removeFav,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
