<template>
  <v-card>
    <v-img :src="product.data.image" height="200px"></v-img>
    <v-card-title>{{ product.data.name }}</v-card-title>
    <v-card-subtitle>{{ product.data.category }}</v-card-subtitle>
    <v-card-text>{{ product.data.description }}</v-card-text>
    <v-card-actions class="justify-center">
      <!-- Display other product details -->
      <v-btn>
        <v-icon color="green" left>mdi-cash</v-icon>
        ${{ product.data.price }}
      </v-btn>
      <v-btn>
        <v-icon color="yellow" left v-if="product.data.rating >= 4">mdi-star</v-icon>
        <v-icon color="yellow" left v-else>mdi-star-outline</v-icon>
        {{ product.data.rating }}
      </v-btn>
      <v-divider vertical></v-divider> <!-- Vertical divider -->
      <v-btn>
        <v-icon color="blue" left>mdi-truck-check-outline</v-icon>
        Stock: {{ product.data.stock }}
      </v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn @click="showModifyDialog = true" color="grey">Modify</v-btn>
      <!-- Delete Button -->
      <v-btn @click="deleteProduct(product.id)" color="red">Delete</v-btn>
    </v-card-actions>
  </v-card>
      <!-- Popup Overlay for Modify Product -->
      <v-dialog v-model="showModifyDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Modify Product</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- Input fields to modify product data -->
            <v-text-field label="Product Name" v-model="modifiedProduct.name"></v-text-field>
            <v-text-field label="Price" v-model="modifiedProduct.price" prefix="$"></v-text-field>
            <v-text-field label="Rating" type="number" v-model="modifiedProduct.rating"></v-text-field>
            <v-text-field label="Stock" type="number" v-model="modifiedProduct.stock"></v-text-field>
            <v-text-field label="Image URL" v-model="modifiedProduct.image"></v-text-field>
            <v-text-field label="Category" v-model="modifiedProduct.category"></v-text-field>
            <v-textarea label="Description" v-model="modifiedProduct.description"></v-textarea>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text="true" @click="showModifyDialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" text="true" @click="updateProduct(modifiedProduct, product.data.name)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>


<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ProductDoc } from '../types/product';
import { useProductStore } from '../stores/ProductStore';

export default defineComponent({
  data() {
    return {
      showModifyDialog: false,
      modifiedProduct: {
        name: undefined,
        price: undefined,
        rating: undefined,
        stock: undefined,
        image: undefined,
        category: undefined,
        description: undefined
      }
    };
  },
  props: {
    product: {
      type: Object as PropType<ProductDoc>,
      required: true
    }
  },
  methods: {
    deleteProduct(id: string) {
      // Call the deleteProduct method from ProductStore
      useProductStore().deleteProduct(id);
    },
    updateProduct(modifiedProduct: any, productName: string) {
      // Implement the logic to modify product
      useProductStore().updateProduct(modifiedProduct, productName);
      // Close the dialog after saving
      this.showModifyDialog = false;
    }
  }
});
</script>

<style scoped>
.justify-center {
  display: flex;
  justify-content: center;
}
</style>
