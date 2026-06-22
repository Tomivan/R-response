import { db } from '../config';
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';

interface UserData {
  id: string;
  uid: string;
  name: string;
  email: string;
  displayName?: string;
  role?: string;
  department?: string;
  phone?: string;
  status?: 'Active' | 'Inactive';
  profilePhoto?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const userService = {
  async getAllUsers(): Promise<UserData[]> {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async getUserByUid(uid: string): Promise<UserData | null> {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as UserData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async getUserById(userId: string): Promise<UserData | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as UserData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async updateUser(uid: string, data: Partial<UserData>): Promise<void> {
    try {
      // Find user by uid
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docRef = doc(db, 'users', snapshot.docs[0].id);
        await updateDoc(docRef, {
          ...data,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async getUsersByRole(role: string): Promise<UserData[]> {
    try {
      const q = query(collection(db, 'users'), where('role', '==', role));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
    } catch (error) {
      console.error('Error fetching users by role:', error);
      return [];
    }
  },
};