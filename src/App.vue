<template>
  <v-app>
    <v-app-bar class="bg-blue-darken-4">
      <v-toolbar-title>My Online Store</v-toolbar-title>
      <v-btn class="mx-5" v-for="link in links" :key="link.text" :to="link.to">
        <v-icon>{{ link.icon }}</v-icon>
        {{ link.text }}
      </v-btn>
      <!-- Add Product Button -->
      <v-btn color="green" @click="showDialog = true">
        <v-icon>mdi-plus</v-icon>
        Add Product
      </v-btn>
    </v-app-bar>
    <v-main class="bg-blue-lighten-5">
      <router-view v-slot="{ Component }">
        <transition name="shrink-explode">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!-- Product Creation Dialog -->
    <v-dialog v-model="showDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add a New Product</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Product Name" v-model="newProduct.name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Price" v-model="newProduct.price" prefix="$"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Image URL" v-model="newProduct.image"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Category" v-model="newProduct.category"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Rating" type="number" v-model="newProduct.rating"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field label="Stock" type="number" v-model="newProduct.stock"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea label="Description" v-model="newProduct.description"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text="true" @click="showDialog = false">Cancel</v-btn>
            <v-btn color="green darken-1" @click="addProduct()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-footer color="primary" app>
      © 2024 My Online Store. All rights reserved.
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { db } from './firebaseConfig'; // Adjust the import path as necessary
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const router = useRouter();

const refreshPage = () => {
  router.go(1); // Reloads the current route
};


const links = ref([
  { text: "Home", to: "/", icon: "mdi-home" },
  { text: "Electronics", to: "/electronics", icon: "mdi-laptop" },
  { text: "Clothing", to: "/clothing", icon: "mdi-tshirt-crew" },
  { text: "Groceries", to: "/groceries", icon: "mdi-cart" },
  { text: "Best Seller", to: "/bestseller", icon: "mdi-cash-register" },
]);

const showDialog = ref(false);
const newProduct = ref({
  name: "",
  description: "",
  price: 0, // Default to 0, expecting a number
  rating: 0, // Default to 0, expecting a number
  stock: 0,  // Default to 0, expecting a number
  image: "",
  category: ""
});

const addProduct = async () => {
  const confirmed = window.confirm("Are you sure you want to add this product?");
  if (confirmed) {
    try {
    // Prepare the product data ensuring all fields are correctly typed
    const productData = {
      name: newProduct.value.name,
      description: newProduct.value.description,
      price: (newProduct.value.price),
      rating: (newProduct.value.rating),
      stock: (newProduct.value.stock),
      image: newProduct.value.image,
      category: newProduct.value.category
    };

    const col = collection(db, "products");
    const docRef = await addDoc(col, productData);
    console.log("Product added with ID: ", docRef.id);
    showDialog.value = false;
    
    // Reset form after saving
    newProduct.value = { name: "", description: "", price: 0, rating: 0, stock: 0, image: "", category: "" };
    refreshPage();
  } catch (error) {
    console.error("Error adding document: ", error);
  }

  }
  
};
</script>
