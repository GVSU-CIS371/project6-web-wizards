<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="product in electronicProducts" :key="product.id">
        <StoreItem :product="product" />
      </v-col>
    </v-row>
    <div v-if="loading">Loading products...</div>
    <div v-if="error">{{ error.message }}</div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, Ref } from 'vue';
import StoreItem from './StoreItem.vue';
import { useProductStore } from '../stores/ProductStore';

export default defineComponent({
  components: {
    StoreItem
  },
  setup() {
    const productStore = useProductStore();
    const loading = ref(false);
    // Declare error as a ref that can hold either an Error object or null
    const error: Ref<Error | null> = ref(null);

    onMounted(async () => {
      if (productStore.products.length === 0) {
        loading.value = true;
        try {
          await productStore.init();
        } catch (e) {
          error.value = e as Error;  // Explicitly cast the error to type Error
          console.error("Failed to load products:", e);
        } finally {
          loading.value = false;
        }
      }
    });

    // Computed property to filter products by the 'Electronics' category
    const electronicProducts = computed(() => {
      return productStore.products.filter(product => product.data.category === 'Electronics');
    });

    return {
      electronicProducts,
      loading,
      error
    };
  },
});
</script>
