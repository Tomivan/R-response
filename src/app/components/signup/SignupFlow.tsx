'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Stepper from './Stepper';
import PersonalInfoStep from './PersonalInfoStep';
import RoleDepartmentStep from './RoleDepartmentStep';
import VerificationStep from './VerificationStep';
import styles from './signup.module.css';

export type Step = 1 | 2 | 3;

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  department: string;
  profilePhoto: File | null;
  verificationCode: string[];
}

const initialFormData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: '',
  department: '',
  profilePhoto: null,
  verificationCode: ['', '', '', '', '', ''],
};

export default function SignupFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleNext = () => {
    if (step < 3) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData({ ...formData, ...updates });
  };

  const handleVerify = () => {
    router.push('/success');
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.card} card`}>
        <Stepper currentStep={step} />

        {step === 1 && (
          <PersonalInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <RoleDepartmentStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <VerificationStep
            formData={formData}
            updateFormData={updateFormData}
            onVerify={handleVerify}
          />
        )}
      </div>
    </div>
  );
}