<template>
  <v-card>
    <v-img :src="product.data.image" height="200px"></v-img>
    <v-card-title>{{ product.data.name }}</v-card-title>
    <v-card-subtitle>{{ product.data.category }}</v-card-subtitle>
    <v-card-text>{{ product.data.description }}</v-card-text>
    <v-card-actions style="display: flex; justify-content: center;">
      <v-btn>
        <v-icon color="green" left>mdi-cash</v-icon>
        ${{ product.data.price }}
      </v-btn>
      <v-btn>
        <v-icon color="yellow" left v-if="product.data.rating >= 4">mdi-star</v-icon>
        <v-icon color="yellow" left v-else>mdi-star-outline</v-icon>
        {{ product.data.rating }}
      </v-btn>
      <v-btn>
        <v-icon color="blue" left>mdi-truck-check-outline</v-icon>
        Stock: {{ product.data.stock }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ProductDoc } from '../types/product'; // Import the type definition

export default defineComponent({
  props: {
    product: {
      type: Object as PropType<ProductDoc>,
      required: true
    }
  }
});
</script>