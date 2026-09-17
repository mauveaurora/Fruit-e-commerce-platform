import { defineStore } from 'pinia';
import { fetchCartItems } from '@/api/cart';
export const useCartStore = defineStore('cart', {
    state: () => ({
        count: 0
    }),
    actions: {
        async refreshCount() {
            if (!localStorage.getItem('token')) {
                this.count = 0;
                return 0;
            }
            const items = await fetchCartItems();
            this.count = items.reduce((sum, item) => sum + item.quantity, 0);
            return this.count;
        }
    }
});
