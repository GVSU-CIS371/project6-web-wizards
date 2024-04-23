// src/stores/ProductStore.ts

import { defineStore } from 'pinia';
import { collection, getDocs, doc, setDoc, deleteDoc, query, where, DocumentData, addDoc } from 'firebase/firestore';
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

    //Add or update the addProduct method in ProductStore.ts
    async updateProduct(modifiedProduct: Product, productName: string) {
      try {
        const col = collection(db, "products");
    
        // Query Firestore to find the product by productName
        const querySnapshot = await getDocs(query(col, where("name", "==", productName)));
        console.log("Query snapshot:", querySnapshot);
    
        // Check if the product exists
        if (!querySnapshot.empty) {
          const productDoc = querySnapshot.docs[0];
          console.log("Product document:", productDoc);
    
          const productData = productDoc.data() as Product;
          console.log("Product data:", productData);
    
          // Prepare the updated product data with changes from modifiedProduct
          const updatedProductData: Partial<Product> = {};
    
          // Compare each field with modifiedProduct and update if changed
          if (modifiedProduct.name !== undefined && modifiedProduct.name !== productData.name) {
            updatedProductData.name = modifiedProduct.name;
          }
          if (modifiedProduct.description !== undefined && modifiedProduct.description !== productData.description) {
            updatedProductData.description = modifiedProduct.description;
          }
          if (modifiedProduct.price !== undefined && modifiedProduct.price !== productData.price) {
            updatedProductData.price = modifiedProduct.price;
          }
          if (modifiedProduct.rating !== undefined && modifiedProduct.rating !== productData.rating) {
            updatedProductData.rating = modifiedProduct.rating;
          }
          if (modifiedProduct.stock !== undefined && modifiedProduct.stock !== productData.stock) {
            updatedProductData.stock = modifiedProduct.stock;
          }
          if (modifiedProduct.image !== undefined && modifiedProduct.image !== productData.image) {
            updatedProductData.image = modifiedProduct.image;
          }
          if (modifiedProduct.category !== undefined && modifiedProduct.category !== productData.category) {
            updatedProductData.category = modifiedProduct.category;
          }
    
          console.log("Updated product data:", updatedProductData);
    
          // If any fields are updated, update the product in Firestore
          if (Object.keys(updatedProductData).length > 0) {
            await setDoc(doc(col, productDoc.id), updatedProductData, { merge: true });
            console.log("Product updated:", productName);
              // Find the product in your component's data and update it
            const productIndex = this.products.findIndex(product => product.data.name === productName);
            if (productIndex !== -1) {
              this.products[productIndex] = { ...this.products[productIndex], ...updatedProductData };
            }
          } else {
            console.log("No changes to update for product:", productName);
          }
        } else {
          console.log("Product not found:", productName);
        }
      } catch (error) {
        console.error("Error updating product:", error);
      }
    },
    
    async deleteProduct(id: string) {
      const productRef = doc(db, "products", id);
      await deleteDoc(productRef);
      this.products = this.products.filter(product => product.id !== id);
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
