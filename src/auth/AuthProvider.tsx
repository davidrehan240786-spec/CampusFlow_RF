import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase/firebase";
import { signIn, signInWithGoogle, signOut, signUp } from "./firebaseAuth";

type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  trustScore: number;
  role: string;
  verified: boolean;
  createdAt: unknown;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  profile: UserProfile | null;
  signUp: typeof signUp;
  signIn: typeof signIn;
  signInWithGoogle: typeof signInWithGoogle;
  signOut: typeof signOut;
  logout: typeof signOut;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, "users", nextUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      } else {
        const newProfile: UserProfile = {
          uid: nextUser.uid,
          displayName: nextUser.displayName || "Anonymous",
          email: nextUser.email || "",
          photoURL: nextUser.photoURL || "",
          trustScore: 98,
          role: "user",
          verified: true,
          createdAt: serverTimestamp(),
        };
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      profile,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      logout: signOut,
    }),
    [user, loading, profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

