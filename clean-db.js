import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

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

async function cleanDB() {
  console.log("Starting cleanup...");
  let count = 0;
  
  const rolesToDelete = ['player', 'student', 'coach'];
  
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', 'in', rolesToDelete));
    
    const snapshot = await getDocs(q);
    console.log(`Found ${snapshot.size} users to delete.`);
    
    for (const document of snapshot.docs) {
      await deleteDoc(doc(db, 'users', document.id));
      console.log(`Deleted ${document.id} (${document.data().role})`);
      count++;
    }
    
    console.log(`Successfully deleted ${count} enrolled players and coaches.`);
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
  process.exit(0);
}

cleanDB();
