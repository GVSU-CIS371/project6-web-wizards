<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="product in allProducts" :key="product.id">
        <StoreItem :product="product" />
      </v-col>
    </v-row>
    <div v-if="loading">Loading products...</div>
    <div v-if="error">{{ error.message }}</div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, Ref } from 'vue';
import StoreItem from '../components/StoreItem.vue';
import { useProductStore } from '../stores/ProductStore';

export default defineComponent({
  components: {
    StoreItem
  },
  setup() {
    const productStore = useProductStore();
    const loading = ref(false);
    // Define error as Ref<Error | null> to allow storing Error objects
    const error: Ref<Error | null> = ref(null);

    onMounted(async () => {
      loading.value = true;
      try {
        await productStore.init();
      } catch (e) {
        // Properly handle and typecast the error
        error.value = e as Error;
        console.error("Failed to load products:", e);
      } finally {
        loading.value = false;
      }
    });

    const allProducts = computed(() => productStore.products);

    return {
      allProducts,
      loading,
      error
    };
  },
});
</script>
