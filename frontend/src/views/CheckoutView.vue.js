/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createOrder, previewOrder } from '@/api/orders';
import { fetchAddresses } from '@/api/user';
import { useCartStore } from '@/stores/cart';
const router = useRouter();
const cartStore = useCartStore();
const loading = ref(false);
const submitting = ref(false);
const error = ref('');
const preview = ref(null);
const addresses = ref([]);
const selectedAddressId = ref(null);
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
    }
    catch (e) {
        error.value = e.message || '加载结算信息失败';
    }
    finally {
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
    }
    catch (e) {
        window.alert(e.message || '下单失败');
    }
    finally {
        submitting.value = false;
    }
}
onMounted(() => {
    loadData();
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
if (!__VLS_ctx.loading && __VLS_ctx.preview) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    if (!__VLS_ctx.addresses.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        const __VLS_0 = {}.RouterLink;
        /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            to: "/profile",
            ...{ style: {} },
        }));
        const __VLS_2 = __VLS_1({
            to: "/profile",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        __VLS_3.slots.default;
        var __VLS_3;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "address-list" },
        });
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.addresses))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
                ...{ class: "address-item" },
                key: (item.id),
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
                type: "radio",
                value: (item.id),
            });
            (__VLS_ctx.selectedAddressId);
            (item.receiver);
            (item.phone);
            (item.province);
            (item.city);
            (item.detailAddress);
            if (item.isDefault) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
            }
        }
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
        ...{ style: {} },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
        ...{ class: "table" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.preview.items))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
            key: (item.cartItemId),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (item.productName);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "price" },
        });
        (Number(item.unitPrice).toFixed(2));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
        (item.quantity);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
            ...{ class: "price" },
        });
        (Number(item.subtotal).toFixed(2));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "summary-row" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "price" },
    });
    (Number(__VLS_ctx.preview.payAmount).toFixed(2));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.submitOrder) },
        ...{ class: "solid-btn" },
        disabled: (__VLS_ctx.submitting || !__VLS_ctx.addresses.length),
    });
    (__VLS_ctx.submitting ? '提交中...' : '提交订单');
}
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['alert']} */ ;
/** @type {__VLS_StyleScopedClasses['address-list']} */ ;
/** @type {__VLS_StyleScopedClasses['address-item']} */ ;
/** @type {__VLS_StyleScopedClasses['table']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-row']} */ ;
/** @type {__VLS_StyleScopedClasses['price']} */ ;
/** @type {__VLS_StyleScopedClasses['solid-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            submitting: submitting,
            error: error,
            preview: preview,
            addresses: addresses,
            selectedAddressId: selectedAddressId,
            submitOrder: submitOrder,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
