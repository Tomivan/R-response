'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '../sidebar/sidebar';
import Topbar from '../topbar/topbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
}

const incidents: Incident[] = [
  {
    id: '#INC-4821',
    type: 'Structure Fire',
    department: 'Fire Department',
    status: 'Open',
    timestamp: '14:32:01',
  },
  {
    id: '#INC-4828',
    type: 'Traffic Collision',
    department: 'Security Department',
    status: 'In-Progress',
    timestamp: '14:28:45',
  },
  {
    id: '#INC-4819',
    type: 'Medical Assistance',
    department: 'Health Centre',
    status: 'Resolved',
    timestamp: '14:15:22',
  },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

   const router = useRouter();
  
  const totalPages = 11;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchDepartment = selectedDepartment === 'All' || incident.department === selectedDepartment;
    const matchStatus = selectedStatus === 'All' || incident.status === selectedStatus;
    return matchDepartment && matchStatus;
  });

  const handleAction = (incidentId: string, action: string) => {
    console.log(`Incident ${incidentId}: ${action}`);
    setOpenDropdown(null);
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

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Topbar onMenuToggle={toggleSidebar} />
      
      <main className={`${styles.main} ${!sidebarOpen ? styles.fullWidth : ''}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Incident Overview</h1>
          <p className={styles.subtitle}>Real-time command and control center for city-wide alerts.</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <Image src={IncidentIcon} alt="a triangle with an exclamation in the middle" width={30} height={30} className={styles.icon}/>
            <span className={styles.statLabel}>TOTAL INCIDENTS</span>
            <span className={styles.statValue}>1,284</span>
          </div>
          <div className={styles.statCard}>
            <Image src={Active} alt="a triangle with an exclamation in the middle" width={30} height={30} className={styles.icon}/>
            <span className={styles.statLabel}>ACTIVE</span>
            <span className={styles.statValue}>42</span>
          </div>
          <div className={styles.statCard}>
            <Image src={Resolved} alt="a triangle with an exclamation in the middle" width={30} height={30} className={styles.icon}/>
            <span className={styles.statLabel}>RESOLVED</span>
            <span className={styles.statValue}>1,242</span>
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
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident) => (
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
                    <td>
                      <div className={styles.actionWrapper} ref={openDropdown === incident.id ? dropdownRef : null}>
                        <button 
                          className={styles.actionEyeBtn}
                          onClick={() => toggleDropdown(incident.id)}
                        >
                          <Image src={Eye} alt="a triangle with an exclamation in the middle" width={20} height={20} />
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.tableFooter}>
            <span className={styles.footerText}>Showing {filteredIncidents.length} of 42 reported incidents</span>
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