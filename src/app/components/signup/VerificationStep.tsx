import { FormData } from './SignupFlow';
import styles from './signup.module.css';

interface VerificationStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onVerify: () => void;
}

export default function VerificationStep({
  formData,
  updateFormData,
  onVerify,
}: VerificationStepProps) {
  const handleCodeChange = (idx: number, value: string) => {
    const newCode = [...formData.verificationCode];
    newCode[idx] = value.replace(/\D/g, '');
    updateFormData({ verificationCode: newCode });

    // Auto-advance to next input
    if (value && idx < 5) {
      const next = document.querySelector(`.${styles.codeDigit}:nth-child(${idx + 2})`) as HTMLInputElement;
      if (next) next.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && idx > 0) {
      const prev = document.querySelector(`.${styles.codeDigit}:nth-child(${idx})`) as HTMLInputElement;
      if (prev) prev.focus();
    }
  };

  return (
    <div className={styles.stepContent}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>Verify Your Account</h1>
        <p className={styles.stepSubtitle}>
          Enter the 6-digit code sent to your email <strong>j***@citygov.org</strong> to complete your registration.
        </p>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Verification Code</label>
        <div className={styles.codeInputs}>
          {formData.verificationCode.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              className={`input ${styles.codeDigit}`}
              value={digit}
              onChange={(e) => handleCodeChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
            />
          ))}
        </div>
      </div>

      <button className="button-primary" onClick={onVerify}>
        Verify & Continue
      </button>

      <div className={styles.resendRow}>
        <span>Didn't receive a code? Resend in 0:58</span>
        <button className={styles.resendBtn}>Resend Code</button>
      </div>
    </div>
  );
}