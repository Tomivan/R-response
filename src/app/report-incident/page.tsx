'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/sidebar';
import Topbar from '../components/topbar/topbar';
import Image from 'next/image';
import { useAuthStore } from '../../../store/authStore';
import { useIncidentStore } from '../../../store/incidentStore';
import { incidentService } from '../../../firebase/services/incidentServices';
import showAlert from '../../../utils/alert';
import IncidentDetails from '../../../public/images/incident-details.svg';
import Classification from '../../../public/images/classification.svg';
import Media from '../../../public/images/media.svg';
import Upload from '../../../public/images/upload.svg';
import styles from './report-incident.module.css';

export default function ReportIncidentPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addIncident } = useIncidentStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: 'Security Department',
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.title.trim()) {
        const errorMsg = 'Please enter an incident title.';
        setError(errorMsg);
        showAlert.error(errorMsg);
        setIsLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        const errorMsg = 'Please provide a description of the incident.';
        setError(errorMsg);
        showAlert.error(errorMsg);
        setIsLoading(false);
        return;
      }
      
      const incidentData = {
        type: formData.title,
        description: formData.description,
        department: formData.department,
        status: 'Open' as const,
        timestamp: new Date().toLocaleTimeString(),
        reportedBy: user?.displayName || user?.email || 'Anonymous',
        reportedByUid: user?.uid || '',
        createdAt: new Date().toISOString(),
      };

      // Save to Firebase
      const docId = await incidentService.createIncident(incidentData);
      
      // Update local store
      addIncident({
        id: docId,
        ...incidentData,
      });

      showAlert.success('✅ Incident reported successfully! 🚨');
      router.push('/');
      
    } catch (error: any) {
      console.error('Error reporting incident:', error);
      const errorMsg = 'Failed to report incident. Please try again.';
      setError(errorMsg);
      showAlert.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Topbar onMenuToggle={toggleSidebar} />
      
      <main className={`${styles.main} ${!sidebarOpen ? styles.fullWidth : ''}`}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Report New Incident</h1>
            <p className={styles.subtitle}>Log a new emergency or service request for immediate dispatch.</p>

            <hr className={styles.divider} />

            {error && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <section className={styles.section}>
                <div className="flex">
                  <Image src={IncidentDetails} alt='' width={30} height={30} className={styles.icon} />
                  <h2 className={styles.sectionTitle}>Incident Details</h2>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>INCIDENT TITLE</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Brief summary of the issue (e.g., Water Main Break at 5th Ave)"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>DESCRIPTION</label>
                  <textarea
                    className={`input ${styles.textarea}`}
                    placeholder="Provide detailed information about what occurred, individuals involved, and immediate risks..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    disabled={isLoading}
                    required
                  />
                </div>
              </section>

              <section className={styles.section}>
                <div className="flex">
                  <Image src={Classification} alt='' width={30} height={30} className={styles.icon} />
                  <h2 className={styles.sectionTitle}>Classification</h2>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>RESPONSIBLE DEPARTMENT</label>
                  <select
                    className="input"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    disabled={isLoading}
                  >
                    <option value="Security Department">Security Department</option>
                    <option value="Fire Department">Fire Department</option>
                    <option value="Health Centre">Health Centre</option>
                    <option value="Sanitation">Sanitation</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Water Management">Water Management</option>
                    <option value="Code of Conduct">Code of Conduct</option>
                  </select>
                </div>
              </section>

              <section className={styles.section}>
                <div className="flex">
                  <Image src={Media} alt='' width={30} height={30} className={styles.icon} />
                  <h2 className={styles.sectionTitle}>Media Assets</h2>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>UPLOAD PHOTOS</label>
                  <div className={styles.uploadZone}>
                    <div className={styles.uploadContent}>
                      <Image src={Upload} alt='' width={60} height={60} className={styles.icon} />
                      <p>Drag and drop your files here or click to browse</p>
                      <span className={styles.uploadHint}>Maximum file size: 25MB. Supported formats: JPG, PNG, MP4.</span>
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.mp4"
                      className={styles.uploadInput}
                      multiple
                      disabled={isLoading}
                      onChange={(e) => {
                        if (e.target.files) {
                          console.log('Files selected:', e.target.files);
                        }
                      }}
                    />
                  </div>
                </div>
              </section>

              <div className={styles.actions}>
                <button 
                  type="button" 
                  className={`button-secondary ${styles.cancelBtn}`}
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`button-primary ${styles.submitBtn}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}