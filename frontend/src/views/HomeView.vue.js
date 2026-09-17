/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { fetchRecommendProducts } from '@/api/products';
import { addCartItem } from '@/api/cart';
import { useCartStore } from '@/stores/cart';
const router = useRouter();
const cartStore = useCartStore();
const loading = ref(false);
const error = ref('');
const products = ref([]);
async function loadRecommend() {
    loading.value = true;
    error.value = '';
    try {
        products.value = await fetchRecommendProducts();
    }
    catch (e) {
        error.value = e.message || '加载推荐商品失败';
    }
    finally {
        loading.value = false;
    }
}
async function handleAdd(productId) {
    if (!localStorage.getItem('token')) {
        router.push('/login');
        return;
    }
    try {
        await addCartItem({ productId, quantity: 1 });
        await cartStore.refreshCount();
        window.alert('已加入购物车');
    }
    catch (e) {
        window.alert(e.message || '加入购物车失败');
    }
}
onMounted(() => {
    loadRecommend();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "home-hero card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "solid-btn" },
    to: "/products",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "solid-btn" },
    to: "/products",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "alert" },
    });
    (__VLS_ctx.error);
}
if (!__VLS_ctx.loading && __VLS_ctx.products.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "grid products" },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.products))) {
        /** @type {[typeof ProductCard, ]} */ ;
        // @ts-ignore
        const __VLS_4 = __VLS_asFunctionalComponent(ProductCard, new ProductCard({
            ...{ 'onAdd': {} },
            key: (item.id),
            product: (item),
        }));
        const __VLS_5 = __VLS_4({
            ...{ 'onAdd': {} },
            key: (item.id),
            product: (item),
        }, ...__VLS_functionalComponentArgsRest(__VLS_4));
        let __VLS_7;
        let __VLS_8;
        let __VLS_9;
        const __VLS_10 = {
            onAdd: (__VLS_ctx.handleAdd)
        };
        var __VLS_6;
    }
}
/** @type {__VLS_StyleScopedClasses['home-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['solid-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['alert']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['products']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ProductCard: ProductCard,
            loading: loading,
            error: error,
            products: products,
            handleAdd: handleAdd,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
