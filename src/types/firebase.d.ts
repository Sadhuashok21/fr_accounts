declare module 'firebase/app' {
  export interface FirebaseApp {
    name: string;
    options: Record<string, any>;
  }
  export function initializeApp(options: Record<string, any>, name?: string): FirebaseApp;
  export function getApps(): FirebaseApp[];
  export function getApp(name?: string): FirebaseApp;
}

declare module 'firebase/analytics' {
  export function getAnalytics(app?: any): any;
  export function isSupported(): Promise<boolean>;
}

declare module 'firebase/auth' {
  export interface UserCredential {
    user: {
      uid: string;
      email: string | null;
      displayName: string | null;
      photoURL: string | null;
      getIdToken(forceRefresh?: boolean): Promise<string>;
    };
  }
  export function getAuth(app?: any): any;
  export class GoogleAuthProvider {
    constructor();
    setCustomParameters(params: Record<string, string>): void;
  }
  export function signInWithPopup(auth: any, provider: any): Promise<UserCredential>;
}
