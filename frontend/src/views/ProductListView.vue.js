/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { fetchProducts } from '@/api/products';
import { addCartItem } from '@/api/cart';
import { useCartStore } from '@/stores/cart';
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
const products = ref([]);
const totalPages = ref(1);
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
    }
    catch (e) {
        error.value = e.message || '加载商品失败';
    }
    finally {
        loading.value = false;
    }
}
function search() {
    page.value = 0;
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
    loadProducts();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['filter-grid']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "filter-grid" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    placeholder: "搜索水果名称",
});
(__VLS_ctx.keyword);
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.category),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "浆果",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "仁果",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "热带",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "柑橘",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    placeholder: "产地，如 云南",
});
(__VLS_ctx.origin);
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.sort),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "newest",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "priceAsc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "priceDesc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "salesDesc",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.search) },
    ...{ class: "solid-btn" },
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
        const __VLS_0 = __VLS_asFunctionalComponent(ProductCard, new ProductCard({
            ...{ 'onAdd': {} },
            key: (item.id),
            product: (item),
        }));
        const __VLS_1 = __VLS_0({
            ...{ 'onAdd': {} },
            key: (item.id),
            product: (item),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
        let __VLS_3;
        let __VLS_4;
        let __VLS_5;
        const __VLS_6 = {
            onAdd: (__VLS_ctx.handleAdd)
        };
        var __VLS_2;
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "pager" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.prevPage) },
    ...{ class: "ghost-btn" },
    disabled: (__VLS_ctx.page === 0),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
(__VLS_ctx.page + 1);
(__VLS_ctx.totalPages);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.nextPage) },
    ...{ class: "ghost-btn" },
    disabled: (__VLS_ctx.page >= __VLS_ctx.totalPages - 1),
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['solid-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['alert']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['products']} */ ;
/** @type {__VLS_StyleScopedClasses['pager']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ghost-btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ProductCard: ProductCard,
            keyword: keyword,
            category: category,
            origin: origin,
            sort: sort,
            page: page,
            loading: loading,
            error: error,
            products: products,
            totalPages: totalPages,
            search: search,
            prevPage: prevPage,
            nextPage: nextPage,
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
