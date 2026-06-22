import { auth, db } from '../config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  ActionCodeSettings,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

interface UserData {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  department?: string;
  employeeId?: string;
  profilePhoto?: string;
  createdAt?: string;
  updatedAt?: string;
  emailVerified?: boolean;
  verificationCode?: string;
  verificationCodeExpiry?: string;
}

export const authService = {
  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  async register(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  },

  async saveUserData(uid: string, data: any) {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data);
  },

  async updateUserData(uid: string, data: any) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
  },

  async getUserData(uid: string): Promise<UserData | null> {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return { 
        id: snapshot.id, 
        ...snapshot.data() 
      } as UserData;
    }
    return null;
  },

  async getUserRole(uid: string): Promise<string> {
    const userData = await this.getUserData(uid);
    return userData?.role || 'user';
  },

  async sendVerificationCode(email: string) {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10); 

    // Find user by email and update with verification code
    const user = auth.currentUser;
    if (user) {
      await this.updateUserData(user.uid, {
        verificationCode: code,
        verificationCodeExpiry: expiry.toISOString(),
      });
    }

    return code;
  },

  async verifyCode(uid: string, code: string): Promise<boolean> {
  try {
    const userData = await this.getUserData(uid);
    if (!userData) return false;

    const storedCode = userData.verificationCode;
    const expiry = userData.verificationCodeExpiry;

    if (!storedCode || !expiry) return false;

    // Check if code matches and is not expired
    if (storedCode !== code) return false;

    const expiryDate = new Date(expiry);
    if (expiryDate < new Date()) return false;

    // Mark email as verified and update user status
    await this.updateUserData(uid, {
      emailVerified: true,
      verificationCode: null,
      verificationCodeExpiry: null,
      status: 'Active',
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error verifying code:', error);
    return false;
  }
},
  async logout() {
    await signOut(auth);
  },

  async resetPassword(email: string) {
    const actionCodeSettings: ActionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/set-new-password`,
      handleCodeInApp: true,
    };

    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  },

  async verifyPasswordResetCode(code: string) {
    return await verifyPasswordResetCode(auth, code);
  },

  async confirmPasswordReset(code: string, newPassword: string) {
    await confirmPasswordReset(auth, code, newPassword);
  },
  getCurrentUser(): User | null {
    return auth.currentUser;
  },
};