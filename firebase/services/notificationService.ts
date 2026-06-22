import { db } from '../config';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';

interface Notification {
  id?: string;
  type: string;
  title: string;
  message: string;
  sentBy: string;
  sentByUid: string;
  recipients: Array<{ uid: string; email: string; name: string }>;
  recipientCount: number;
  status: 'sent' | 'draft' | 'failed';
  readBy: string[];
  createdAt: string;
}

export const notificationService = {
  async sendNotification(notificationData: Omit<Notification, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },

  async getNotifications(): Promise<Notification[]> {
    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async getUserNotifications(uid: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const allNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      
      return allNotifications.filter(notif => 
        notif.recipients?.some(r => r.uid === uid) || 
        notif.type === 'general' ||
        notif.type === 'alert' ||
        notif.type === 'update'
      );
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return [];
    }
  },

  async getAdminNotifications(uid: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('type', 'in', ['incident', 'assignment']),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      return [];
    }
  },

  // Real-time listener for notifications
  listenForNotifications(
    uid: string, 
    isAdmin: boolean, 
    callback: (notifications: Notification[]) => void
  ) {
    let q;
    
    if (isAdmin) {
      q = query(
        collection(db, 'notifications'),
        where('type', 'in', ['incident', 'assignment']),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
    } else {
      q = query(
        collection(db, 'notifications'),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      
      // Filter for user-specific notifications
      const userNotifications = notifications.filter(notif => 
        !isAdmin ? 
          (notif.recipients?.some(r => r.uid === uid) || 
           ['general', 'alert', 'update', 'maintenance', 'training'].includes(notif.type))
          : true
      );
      
      callback(userNotifications);
    }, (error) => {
      console.error('Error listening to notifications:', error);
    });

    return unsubscribe;
  },

  async markAsRead(notificationId: string, uid: string): Promise<void> {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const readBy = data.readBy || [];
        if (!readBy.includes(uid)) {
          await updateDoc(docRef, {
            readBy: [...readBy, uid],
          });
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  async getUnreadCount(uid: string, isAdmin: boolean): Promise<number> {
    try {
      let notifications;
      if (isAdmin) {
        notifications = await this.getAdminNotifications(uid);
      } else {
        notifications = await this.getUserNotifications(uid);
      }
      return notifications.filter(n => !(n.readBy || []).includes(uid)).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },
};