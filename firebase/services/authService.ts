import { auth } from '../config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config';

export const authService = {
  async getUserRole(uid: string) {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role || 'user';
    }
    return 'user';
  },

   async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const role = await this.getUserRole(user.uid);
    return { ...user, role };
  },

  async register(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  },

  async logout() {
    await signOut(auth);
  },

  async resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  },

  getCurrentUser(): User | null {
    return auth.currentUser;
  },
};