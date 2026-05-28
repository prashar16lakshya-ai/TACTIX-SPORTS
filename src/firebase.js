import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCIVGUBciWat4Kx1_LzqqhODdOw9sZKplI",
  authDomain: "tactix-pwa-new-2026.firebaseapp.com",
  projectId: "tactix-pwa-new-2026",
  storageBucket: "tactix-pwa-new-2026.firebasestorage.app",
  messagingSenderId: "160203350263",
  appId: "1:160203350263:web:cf6a6e1469f14f9dbaf3f2"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

