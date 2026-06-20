'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import Topbar from '../topbar/topbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../store/authStore';
import { useIncidentStore } from '../../../../store/incidentStore';
import { incidentService } from '../../../../firebase/services/incidentServices';
import IncidentIcon from '../../../../public/images/incident.svg';
import Active from '../../../../public/images/active.svg';
import Resolved from '../../../../public/images/resolved.svg';
import Eye from '../../../../public/images/eye.svg';
import styles from './incident-dashboard.module.css';

interface Incident {
  id: string;
  type: string;
  department: string;
  status: 'Open' | 'In-Progress' | 'Resolved';
  timestamp: string;
  description?: string;
  priority: string;
  location?: string;
  createdAt?: any;
}

const departments = ['All', 'Fire Department', 'Security Department', 'Health Centre', 'Sanitation', 'Electrical', 'Water Management', 'Code of Conduct'];
const statusOptions = ['All', 'Open', 'In-Progress', 'Resolved'];

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Open':
      return styles.statusOpen;
    case 'In-Progress':
      return styles.statusProgress;
    case 'Resolved':
      return styles.statusResolved;
    default:
      return '';
  }
};

export default function IncidentDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { incidents, setIncidents, isLoading } = useIncidentStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const totalPages = 11;
  const isAdmin = user?.role === 'admin';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch incidents from Firebase
  useEffect(() => {
  const fetchIncidents = async () => {
    try {
      const fetchedIncidents = await incidentService.getIncidents();
      const mappedIncidents: Incident[] = fetchedIncidents.map((item: any) => ({
        id: item.id || '',
        type: item.type || '',
        department: item.department || '',
        status: (item.status || 'Open') as 'Open' | 'In-Progress' | 'Resolved',
        timestamp: item.timestamp || new Date().toLocaleTimeString(),
        description: item.description || '',
        priority: item.priority ? item.priority : 'MED',
        location: item.location || '',
        createdAt: item.createdAt,
      }));
      setIncidents(mappedIncidents);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };
  fetchIncidents();
}, [setIncidents]);


  const filteredIncidents = incidents.filter(incident => {
    const matchDepartment = selectedDepartment === 'All' || incident.department === selectedDepartment;
    const matchStatus = selectedStatus === 'All' || incident.status === selectedStatus;
    return matchDepartment && matchStatus;
  });

  const handleAction = async (incidentId: string, action: string) => {
    try {
      await incidentService.updateIncident(incidentId, { status: action });
      // Update local state
      setIncidents(incidents.map(inc => 
        inc.id === incidentId ? { ...inc, status: action as any } : inc
      ));
      setOpenDropdown(null);
    } catch (error) {
      console.error('Error updating incident:', error);
    }
  };

  const toggleDropdown = (incidentId: string) => {
    setOpenDropdown(openDropdown === incidentId ? null : incidentId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.dashboard}>
      {isAdmin && <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />}
      <Topbar onMenuToggle={toggleSidebar} />
      
      <main className={`${styles.main} ${!isAdmin || !sidebarOpen ? styles.fullWidth : ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Incident Overview</h1>
          <p className={styles.subtitle}>Real-time command and control center for city-wide alerts.</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <Image src={IncidentIcon} alt="Total Incidents" width={30} height={30} className={styles.icon}/>
            <span className={styles.statLabel}>TOTAL INCIDENTS</span>
            <span className={styles.statValue}>{incidents.length}</span>
          </div>
          <div className={styles.statCard}>
            <Image src={Active} alt="Active Incidents" width={30} height={30} className={styles.icon}/>
            <span className={styles.statLabel}>ACTIVE</span>
            <span className={styles.statValue}>{incidents.filter(i => i.status === 'Open' || i.status === 'In-Progress').length}</span>
          </div>
          <div className={styles.statCard}>
            <Image src={Resolved} alt="Resolved Incidents" width={30} height={30} className={styles.icon}/>
            <span className={styles.statLabel}>RESOLVED</span>
            <span className={styles.statValue}>{incidents.filter(i => i.status === 'Resolved').length}</span>
          </div>
        </div>

        <div className={styles.flexEnd}>
          <button className={styles.reportBtn} onClick={() => router.push('/report-incident')}>
            <span className={styles.reportIcon}>➕</span>
            <span className={styles.reportLabel}>Report New Incident</span>
          </button>
        </div>

        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h2 className={styles.tableTitle}>Reported Incident</h2>
            <div className={styles.filterContainer}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Department</label>
                <select 
                  className={`input ${styles.filterSelect}`}
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Status</label>
                <select 
                  className={`input ${styles.filterSelect}`}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>INCIDENT TYPE</th>
                  <th>DEPARTMENT</th>
                  <th>STATUS</th>
                  <th>TIMESTAMP</th>
                  {isAdmin && <th>ACTIONS</th>}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className={styles.loadingCell}>
                      Loading incidents...
                    </td>
                  </tr>
                ) : filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className={styles.emptyCell}>
                      No incidents found
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td className={styles.incidentId}>{incident.id}</td>
                      <td>{incident.type}</td>
                      <td>{incident.department}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${getStatusClass(incident.status)}`}>
                          {incident.status}
                        </span>
                      </td>
                      <td>{incident.timestamp}</td>
                      {isAdmin && (
                        <td>
                          <div className={styles.actionWrapper} ref={openDropdown === incident.id ? dropdownRef : null}>
                            <button 
                              className={styles.actionEyeBtn}
                              onClick={() => toggleDropdown(incident.id)}
                            >
                              <Image src={Eye} alt="Actions" width={20} height={20} />
                            </button>
                            {openDropdown === incident.id && (
                              <div className={styles.dropdownMenu}>
                                <button 
                                  className={styles.dropdownItem}
                                  onClick={() => handleAction(incident.id, 'Open')}
                                >
                                  Open
                                </button>
                                <button 
                                  className={styles.dropdownItem}
                                  onClick={() => handleAction(incident.id, 'In-Progress')}
                                >
                                  In-Progress
                                </button>
                                <button 
                                  className={styles.dropdownItem}
                                  onClick={() => handleAction(incident.id, 'Resolved')}
                                >
                                  Resolved
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.tableFooter}>
            <span className={styles.footerText}>Showing {filteredIncidents.length} of {incidents.length} reported incidents</span>
            <div className={styles.pagination}>
              <button 
                className={`${styles.pageBtn} ${currentPage === 1 ? styles.pageDisabled : ''}`}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button 
                className={`${styles.pageBtn} ${currentPage === totalPages ? styles.pageDisabled : ''}`}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}