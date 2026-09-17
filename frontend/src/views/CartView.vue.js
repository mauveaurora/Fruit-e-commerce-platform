/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchCartItems, removeCartItem, updateCartItem } from '@/api/cart';
import { useCartStore } from '@/stores/cart';
const router = useRouter();
const cartStore = useCartStore();
const loading = ref(false);
const error = ref('');
const items = ref([]);
const totalAmount = computed(() => items.value.reduce((sum, item) => sum + Number(item.subtotal), 0));
async function loadCart() {
    loading.value = true;
    error.value = '';
    try {
        items.value = await fetchCartItems();
    }
    catch (e) {
        error.value = e.message || '加载购物车失败';
    }
    finally {
        loading.value = false;
    }
}
async function changeQuantity(item, value) {
    try {
        const quantity = Math.max(1, Math.min(item.stock, value));
        await updateCartItem(item.id, { quantity });
        await loadCart();
        await cartStore.refreshCount();
    }
    catch (e) {
        window.alert(e.message || '更新数量失败');
    }
}
async function removeItem(id) {
    try {
        await removeCartItem(id);
        await loadCart();
        await cartStore.refreshCount();
    }
    catch (e) {
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "card" },
});
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
if (!__VLS_ctx.loading && __VLS_ctx.items.length) {
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
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.items))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (item.id),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (item.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "price" },
        });
        (Number(item.price).toFixed(2));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onChange: (...[$event]) => {
                    if (!(!__VLS_ctx.loading && __VLS_ctx.items.length))
                        return;
                    __VLS_ctx.changeQuantity(item, Number($event.target.value));
                } },
            type: "number",
            min: "1",
            max: (item.stock),
            value: (item.quantity),
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "price" },
        });
        (Number(item.subtotal).toFixed(2));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.loading && __VLS_ctx.items.length))
                        return;
                    __VLS_ctx.removeItem(item.id);
                } },
            ...{ class: "ghost-btn" },
        });
    }
}
if (!__VLS_ctx.loading && !__VLS_ctx.items.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
if (__VLS_ctx.items.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "checkout-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "price" },
    });
    (__VLS_ctx.totalAmount.toFixed(2));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.goCheckout) },
        ...{ class: "solid-btn" },
    });
}
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['alert']} */ ;
/** @type {__VLS_StyleScopedClasses['table']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['checkout-row']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['solid-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            error: error,
            items: items,
            totalAmount: totalAmount,
            changeQuantity: changeQuantity,
            removeItem: removeItem,
            goCheckout: goCheckout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
