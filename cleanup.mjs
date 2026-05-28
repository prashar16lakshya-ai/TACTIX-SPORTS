import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCh-tFtCRM1YrtC3DbyayBiXGw0O9OOIZo",
  authDomain: "track-my-play.firebaseapp.com",
  projectId: "track-my-play",
  storageBucket: "track-my-play.firebasestorage.app",
  messagingSenderId: "1022940427789",
  appId: "1:1022940427789:web:4fc843195ac3c0fe978744"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Starting cleanup...");
  
  const teamsSnap = await getDocs(collection(db, 'teams'));
  for (const doc of teamsSnap.docs) {
    await deleteDoc(doc.ref);
    console.log('Deleted team:', doc.id);
  }
  
  const codesSnap = await getDocs(collection(db, 'access_codes'));
  for (const doc of codesSnap.docs) {
    await deleteDoc(doc.ref);
    console.log('Deleted code:', doc.id);
  }

  const usersSnap = await getDocs(collection(db, 'users'));
  for (const doc of usersSnap.docs) {
    const data = doc.data();
    if (data.role !== 'admin') {
      await deleteDoc(doc.ref);
      console.log('Deleted non-admin user:', data.email || doc.id);
    } else {
      console.log('Kept admin user:', data.email || doc.id);
    }
  }
  
  console.log('Cleanup complete!');
  process.exit(0);
}

run().catch(console.error);
