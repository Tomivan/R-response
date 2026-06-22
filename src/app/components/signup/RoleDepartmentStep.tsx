'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FormData } from './SignupFlow';
import Upload from '../../../../public/images/upload.svg';
import { useAuthStore } from '../../../../store/authStore';
import { authService } from '../../../../firebase/services/authService';
import { userService } from '../../../../firebase/services/userService';
import showAlert from '../../../../utils/alert';
import styles from './signup.module.css';
import '../../globals.css';

interface RoleDepartmentStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function RoleDepartmentStep({
  formData,
  updateFormData,
  onNext,
  onBack,
}: RoleDepartmentStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  const handleCreateAccount = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.role) {
        const errorMsg = 'Please select a role.';
        setError(errorMsg);
        showAlert.error(errorMsg);
        setIsLoading(false);
        return;
      }

      if (!formData.department) {
        const errorMsg = 'Please select a department.';
        setError(errorMsg);
        showAlert.error(errorMsg);
        setIsLoading(false);
        return;
      }

      if (user?.uid) {
        await userService.updateUser(user.uid, {
          role: formData.role,
          department: formData.department,
          profilePhoto: formData.profilePhoto ? 'uploaded' : undefined,
          updatedAt: new Date().toISOString(),
        });

        useAuthStore.setState({
          user: {
            ...user,
            role: formData.role as 'admin' | 'user',
            department: formData.department,
          },
        });
        
        // Generate and send 6-digit verification code
        await authService.sendVerificationCode(user.email || '');
        
        showAlert.success('Role and department saved! 📧 Verification code sent to your email.');
        onNext();
      } else {
        const errorMsg = 'User not authenticated. Please restart the signup process.';
        setError(errorMsg);
        showAlert.error(errorMsg);
      }
      
    } catch (error: any) {
      console.error('Error updating role and department:', error);
      const errorMsg = 'Failed to update account information. Please try again.';
      setError(errorMsg);
      showAlert.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.stepContent}>
      <h1 className={styles.stepTitle}>Assign Your Role</h1>
      <p className={styles.stepSubtitle}>
        Identify your position within the Redemption City infrastructure to customize your dashboard access.
      </p>

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      <div className="flex">
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Role Selection</label>
          <select
            className="input"
            value={formData.role}
            onChange={(e) => updateFormData({ role: e.target.value })}
            disabled={isLoading}
            required
          >
            <option value="">Select your role</option>
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
            <option value="dispatcher">Dispatcher</option>
            <option value="field_responder">Field Responder</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Secondary Detail (Department)</label>
          <select
            className="input"
            value={formData.department}
            onChange={(e) => updateFormData({ department: e.target.value })}
            disabled={isLoading}
            required
          >
            <option value="">Select Department</option>
            <option value="Fire Department">Fire Department</option>
            <option value="Security Department">Security Department</option>
            <option value="Health Centre">Health Centre</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Electrical">Electrical</option>
            <option value="Water Management">Water Management</option>
            <option value="Code of Conduct">Code of Conduct</option>
            <option value="IT">IT</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Profile Photo (Optional)</label>
        <div className={styles.dropZone}>
          <div className={styles.dropZoneContent}>
            <Image src={Upload} alt="Upload Icon" width={60} height={60} />
            <p>Drag and drop your photo here or browse files from your device</p>
          </div>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className={styles.dropZoneInput}
            disabled={isLoading}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                updateFormData({ profilePhoto: e.target.files[0] });
              }
            }}
          />
        </div>
        <span className={styles.dropHint}>Recommended size: 488x480px. JPG or PNG only.</span>
      </div>

      <div className={styles.actionRow}>
        <button 
          className="button-primary" 
          onClick={handleCreateAccount}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account →'}
        </button>

        <button 
          className={`button-secondary ${styles.backBtn}`} 
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </button>
      </div>
    </div>
  );
}