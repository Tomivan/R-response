import Image from 'next/image';
import { FormData } from './SignupFlow';
import Upload from '../../../../public/images/upload.svg';
import styles from './signup.module.css';
import '../../globals.css'

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
  return (
    <div className={styles.stepContent}>
      <h1 className={styles.stepTitle}>Assign Your Role</h1>
      <p className={styles.stepSubtitle}>
        Identify your position within the Redemption City infrastructure to customize your dashboard access.
      </p>

      <div className="flex">
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Role Selection</label>
          <select
            className="input"
            value={formData.role}
            onChange={(e) => updateFormData({ role: e.target.value })}
          >
            <option value="">Select your role</option>
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Secondary Detail (Department)</label>
          <select
            className="input"
            value={formData.department}
            onChange={(e) => updateFormData({ department: e.target.value })}
          >
            <option value="">Select Department</option>
            <option value="it">IT</option>
            <option value="hr">Human Resources</option>
            <option value="ops">Operations</option>
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
        <button className="button-primary" onClick={onNext}>
          Create Account →
        </button>

        <button className={`button-secondary ${styles.backBtn}`} onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}