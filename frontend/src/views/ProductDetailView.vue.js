/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchProductDetail } from '@/api/products';
import { addCartItem } from '@/api/cart';
import { addFavorite } from '@/api/user';
import { useCartStore } from '@/stores/cart';
const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const product = ref(null);
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
    }
    catch (e) {
        error.value = e.message || '加载商品详情失败';
    }
    finally {
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
    }
    catch (e) {
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
    }
    catch (e) {
        window.alert(e.message || '收藏失败');
    }
}
onMounted(() => {
    loadDetail();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['detail']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "alert" },
    });
    (__VLS_ctx.error);
}
if (__VLS_ctx.product) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "detail card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        src: (__VLS_ctx.product.coverImage),
        alt: (__VLS_ctx.product.name),
        ...{ class: "cover" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    (__VLS_ctx.product.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "meta" },
    });
    (__VLS_ctx.product.category);
    (__VLS_ctx.product.originPlace);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "price" },
    });
    (Number(__VLS_ctx.product.price).toFixed(2));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.product.stock);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.product.nutritionInfo || '暂无');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.product.description || '暂无');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "action-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        type: "number",
        min: "1",
        max: (__VLS_ctx.product.stock),
        ...{ style: {} },
    });
    (__VLS_ctx.quantity);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.addToCart) },
        ...{ class: "solid-btn" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.collect) },
        ...{ class: "ghost-btn" },
    });
}
/** @type {__VLS_StyleScopedClasses['alert']} */ ;
/** @type {__VLS_StyleScopedClasses['detail']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['cover']} */ ;
/** @type {__VLS_StyleScopedClasses['meta']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['action-row']} */ ;
/** @type {__VLS_StyleScopedClasses['solid-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            product: product,
            quantity: quantity,
            loading: loading,
            error: error,
            addToCart: addToCart,
            collect: collect,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
