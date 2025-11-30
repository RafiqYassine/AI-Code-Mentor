import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, Firestore, collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';

// ------------------------------------------------------------------
// REPLACE WITH YOUR FIREBASE CONFIGURATION
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
// ------------------------------------------------------------------

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

// Initialize Firebase only if config is valid (mock check)
try {
  if (!getApps().length && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else if (getApps().length) {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const googleProvider = new GoogleAuthProvider();

// Auth Helpers
export const loginWithGoogle = async () => {
  if (!auth) throw new Error("Firebase Auth not initialized. Check firebaseConfig in firebase.ts");
  return signInWithPopup(auth, googleProvider);
};

export const logout = async () => {
  if (!auth) return;
  return firebaseSignOut(auth);
};

// Firestore Helpers
export const saveAnalysis = async (userId: string, code: string, mode: string, response: string) => {
  if (!db) {
    console.warn("Firestore not initialized. Skipping save.");
    return;
  }
  try {
    await addDoc(collection(db, "history"), {
      userId,
      codeSnippet: code,
      mode,
      response,
      timestamp: Timestamp.now(),
    });
  } catch (e) {
    console.error("Error saving analysis:", e);
    throw e;
  }
};

export const fetchHistory = async (userId: string) => {
  if (!db) {
    console.warn("Firestore not initialized. Returning empty history.");
    return [];
  }
  try {
    const q = query(
      collection(db, "history"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toMillis() || Date.now()
    }));
  } catch (e) {
    console.error("Error fetching history:", e);
    return [];
  }
};

export { auth, db };
