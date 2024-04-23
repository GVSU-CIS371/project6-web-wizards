import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {

    apiKey: "AIzaSyBkav_-icw05Mp_cQ5a8kKJX-HZdDp9Z_U",
  
    authDomain: "gvsu-cis-371-project-6.firebaseapp.com",
  
    projectId: "gvsu-cis-371-project-6",
  
    storageBucket: "gvsu-cis-371-project-6.appspot.com",
  
    messagingSenderId: "637025165550",
  
    appId: "1:637025165550:web:a3f32db1035633226f93ff",
  
    measurementId: "G-6FJ7961K3K"
  
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore database
export { db };
