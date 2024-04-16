<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="product in allProducts" :key="product.id">
        <StoreItem :product="product" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue';
import StoreItem from './StoreItem.vue';
import { useProductStore } from '../stores/ProductStore';

export default defineComponent({
  components: {
    StoreItem
  },
  setup() {
    const productStore = useProductStore();
    
    onMounted(() => {
      if (productStore.products.length === 0) {
        productStore.init(); // This ensures that the store is initialized on mount if not already loaded
      }
    });

    // Computed property to show all products
    const allProducts = computed(() => productStore.products);

    return {
      allProducts, // Return all products
    };
  },
});
</script>