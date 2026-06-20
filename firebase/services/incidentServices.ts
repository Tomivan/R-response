import { db } from '../config';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';

interface IncidentData {
  id: string;
  type: string;
  department: string;
  status: 'Open' | 'In-Progress' | 'Resolved';
  timestamp: string;
  description?: string;
  priority?: string;
  location?: string;
  createdAt?: Timestamp;
}

export const incidentService = {
  async getIncidents(): Promise<IncidentData[]> {
    const q = query(collection(db, 'incidents'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IncidentData[];
  },

  async createIncident(data: any) {
    const docRef = await addDoc(collection(db, 'incidents'), {
      ...data,
      timestamp: Timestamp.now(),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async updateIncident(id: string, data: any) {
    const docRef = doc(db, 'incidents', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  async deleteIncident(id: string) {
    const docRef = doc(db, 'incidents', id);
    await deleteDoc(docRef);
  },
};