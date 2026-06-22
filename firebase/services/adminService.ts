import { db } from '../config';
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { auth } from '../config';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';

interface AdminData {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: 'Active' | 'Inactive';
  department?: string;
  employeeId?: string;
  createdAt?: string;
}

export const adminService = {
  // Get all admins (users with role = 'admin')
  async getAdmins(): Promise<AdminData[]> {
    try {
      const q = query(
        collection(db, 'users'), 
        where('role', '==', 'admin'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminData[];
    } catch (error) {
      console.error('Error fetching admins:', error);
      return [];
    }
  },

  // Get a single admin by ID
  async getAdminById(adminId: string): Promise<AdminData | null> {
    try {
      const docRef = doc(db, 'users', adminId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as AdminData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching admin:', error);
      return null;
    }
  },

  // Create new admin (with Firebase Auth account)
  async createAdmin(
    email: string, 
    password: string, 
    displayName: string,
    role: string = 'ADMIN',
    department?: string,
    phone?: string
  ): Promise<{ uid: string; docId: string }> {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore
      const docRef = await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: displayName,
        email: email,
        phone: phone || '',
        role: role,
        status: 'Active',
        department: department || '',
        employeeId: `ADMIN-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
      });

      return { uid: user.uid, docId: docRef.id };
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  },

  // Update admin status (Active/Inactive)
  async updateAdminStatus(adminId: string, status: 'Active' | 'Inactive'): Promise<void> {
    try {
      const docRef = doc(db, 'users', adminId);
      await updateDoc(docRef, {
        status: status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating admin status:', error);
      throw error;
    }
  },

  // Update admin details
  async updateAdmin(adminId: string, data: Partial<AdminData>): Promise<void> {
    try {
      const docRef = doc(db, 'users', adminId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  },

  // Delete admin (remove from Auth and Firestore)
  async deleteAdmin(adminId: string): Promise<void> {
    try {
      // First get the admin data to get the UID
      const docRef = doc(db, 'users', adminId);
      const snapshot = await getDoc(docRef);
      
      if (snapshot.exists()) {
        const data = snapshot.data();
        const uid = data.uid;

        // Delete from Firestore
        await deleteDoc(docRef);

        // Delete from Firebase Auth
        try {
          const user = auth.currentUser;
          if (user && user.uid === uid) {
            await deleteUser(user);
          } else {
            console.warn('Cannot delete user from Auth - user not found or not authorized');
          }
        } catch (authError) {
          console.warn('Could not delete user from Auth:', authError);
          // Continue even if auth deletion fails
        }
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  },

  // Check if a user is an admin
  async isAdmin(uid: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, 'users'),
        where('uid', '==', uid),
        where('role', '==', 'admin')
      );
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
};