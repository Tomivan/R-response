import { create } from 'zustand';

interface Incident {
  id: string;
  type: string;
  department: string;
  priority: string;
  status: string;
  timestamp: string;
  description?: string;
  location?: string;
}

interface IncidentState {
  incidents: Incident[];
  isLoading: boolean;
  setIncidents: (incidents: Incident[]) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, data: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],
  isLoading: false,
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) =>
    set((state) => ({ incidents: [incident, ...state.incidents] })),
  updateIncident: (id, data) =>
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === id ? { ...incident, ...data } : incident
      ),
    })),
  deleteIncident: (id) =>
    set((state) => ({
      incidents: state.incidents.filter((incident) => incident.id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));