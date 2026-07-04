import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import {
  GoogleAuthProvider,
  getAuth,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/** True only when every required config value is present. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
);

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);

  authInstance = getAuth(app);
  // Keep the user signed in across reloads / offline.
  void setPersistence(authInstance, browserLocalPersistence);

  // Offline-first: cache Firestore data in IndexedDB and sync when online.
  // Multi-tab manager keeps several open tabs consistent.
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });

  // Analytics is optional and only supported in browser environments — guard it.
  if (firebaseConfig.measurementId) {
    void isAnalyticsSupported()
      .then((supported) => {
        if (supported && app) getAnalytics(app);
      })
      .catch(() => {
        /* analytics unavailable — non-fatal */
      });
  }
}

/** Auth instance. Throws if Firebase is not configured — guard with isFirebaseConfigured. */
export function getAuthOrThrow(): Auth {
  if (!authInstance) throw new Error('Firebase is not configured');
  return authInstance;
}

/** Firestore instance. Throws if Firebase is not configured — guard with isFirebaseConfigured. */
export function getDbOrThrow(): Firestore {
  if (!dbInstance) throw new Error('Firebase is not configured');
  return dbInstance;
}

export const googleProvider = new GoogleAuthProvider();
