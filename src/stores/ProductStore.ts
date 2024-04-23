// src/stores/ProductStore.ts

import { defineStore } from 'pinia';
import { collection, getDocs, doc, setDoc, deleteDoc, query, where, DocumentData } from 'firebase/firestore';
import { ProductDoc, Product } from '../types/product'; // Make sure the path is correct
import { initProducts } from '../data-init'; // Ensure this path is correct
import { db } from '../firebaseConfig.ts'; // Adjust the path as necessary

export const useProductStore = defineStore('ProductStore', {
  state: () => ({
    products: [] as ProductDoc[] // Explicitly type the state to resolve 'never' type issues
  }),

  actions: {
    async init() {
      const col = collection(db, "products");
      const snapshot = await getDocs(col);
      console.log("Fetched data:", snapshot.docs.map(doc => doc.data()));

      // Check if the Firestore collection is empty
      if (snapshot.empty) {
        console.log("No products found, initializing...");
        // Only initialize Firestore with products from data-init.ts if the collection is empty
        await Promise.all(initProducts.map(async (product) => {
          const productRef = doc(col, product.id);
          await setDoc(productRef, product.data);
          console.log(`Product ${product.id} initialized.`);
        }));
        console.log("All products initialized.");
        // Update local state after initialization
        this.products = initProducts.map(product => ({
          ...product,
          id: product.id  // Assuming id is part of product data
        }));
      } else {
        console.log("Products already exist in Firestore.");
        // Load products from Firestore into the state if not empty
        this.products = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data() as Product
        }));
      }
    },

    async addProduct(product: ProductDoc) {
      const col = collection(db, "products");
      const productRef = doc(col);
      await setDoc(productRef, product.data, { merge: true });
      this.products.push({ ...product, id: productRef.id });
    },

    async deleteProduct(id: string) {
      const productRef = doc(db, "products", id);
      await deleteDoc(productRef);
      this.products = this.products.filter(product => product.id !== id);
    },

    async updateProduct(id: string, updatedData: DocumentData) {
      const productRef = doc(db, "products", id);
      await setDoc(productRef, updatedData, { merge: true });
      const index = this.products.findIndex(product => product.id === id);
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...updatedData };
      }
    },

    async filterByCategory(category: string) {
      const col = collection(db, "products");
      const categoryQuery = query(col, where("category", "==", category));
      const snapshot = await getDocs(categoryQuery);
      this.products = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data() as Product
      }));
    },

    async filterByRating(rating: number) {
      const col = collection(db, "products");
      const ratingQuery = query(col, where("rating", ">=", rating));
      const snapshot = await getDocs(ratingQuery);
      this.products = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data() as Product
      }));
    }
  }
});
