import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, type UserCredential } from "firebase/auth";

// SkilTrix Firebase configuration
export const skiltrixFirebaseConfig = {
  apiKey: "AIzaSyDLQ1_nWwRDJQBh3yGGm7_1YLZJL8hCGAE",
  authDomain: "skiltrix.firebaseapp.com",
  projectId: "skiltrix",
  storageBucket: "skiltrix.firebasestorage.app",
  messagingSenderId: "386011076890",
  appId: "1:386011076890:web:ea2bea7119aa16404a74a3",
  measurementId: "G-PXT30QYTL5"
};

// SFS Blueprints Firebase configuration
export const sfsFirebaseConfig = {
  apiKey: "AIzaSyAvBa5bK5HXoo3pbciYV9A7W8AQTvCzPuE",
  authDomain: "sfs-blueprints-21.firebaseapp.com",
  projectId: "sfs-blueprints-21",
  storageBucket: "sfs-blueprints-21.firebasestorage.app",
  messagingSenderId: "550104831070",
  appId: "1:550104831070:web:fc2c73ae565b6e0f6350cf",
  measurementId: "G-HZTPYKWVBR"
};

export function resolveAppType(typeParam?: string | null, clientIdParam?: string | null): "skiltrix" | "sfs" {
  const normType = (typeParam || clientIdParam || "").toLowerCase().trim();
  if (normType.includes("sfs") || normType === "main") {
    return "sfs";
  }
  return "skiltrix";
}

export function getFirebaseConfig(appType: "skiltrix" | "sfs") {
  return appType === "sfs" ? sfsFirebaseConfig : skiltrixFirebaseConfig;
}

export function getFirebaseInstance(appType: "skiltrix" | "sfs"): FirebaseApp {
  const appName = `firebase_${appType}`;
  const existingApps = getApps();
  const found = existingApps.find((a: FirebaseApp) => a.name === appName);
  if (found) {
    return found;
  }

  const config = getFirebaseConfig(appType);
  const app = initializeApp(config, appName);

  // Initialize analytics if supported in current browser environment
  if (typeof window !== "undefined") {
    isSupported().then((supported: boolean) => {
      if (supported) {
        try {
          getAnalytics(app);
        } catch {
          // Analytics optional or blocked by client extensions
        }
      }
    }).catch(() => {});
  }

  return app;
}

export interface GoogleAuthResult {
  email: string;
  name: string;
  lastname: string;
  photoURL: string;
  idToken: string;
  uid: string;
}

export async function signInWithGoogle(appType: "skiltrix" | "sfs"): Promise<GoogleAuthResult> {
  const app = getFirebaseInstance(appType);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const result: UserCredential = await signInWithPopup(auth, provider);
  const firebaseUser = result.user;

  const idToken = await firebaseUser.getIdToken();
  const displayName = firebaseUser.displayName || "";
  const parts = displayName.trim().split(/\s+/);
  const name = parts[0] || (firebaseUser.email ? firebaseUser.email.split("@")[0] : "User");
  const lastname = parts.slice(1).join(" ");

  return {
    email: firebaseUser.email || "",
    name,
    lastname,
    photoURL: firebaseUser.photoURL || "",
    idToken,
    uid: firebaseUser.uid,
  };
}
