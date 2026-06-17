import styles from './signup.module.css';

interface StepperProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { number: 1, label: 'Personal Info' },
  { number: 2, label: 'Role & Department' },
  { number: 3, label: 'Verification' },
];

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => (
        <div key={step.number} className={styles.stepWrapper}>
          <div className={styles.stepItem}>
            <div className={`${styles.stepCircle} ${currentStep >= step.number ? styles.active : ''}`}>
              {step.number}
            </div>
            <span className={styles.stepLabel}>{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`${styles.stepLine} ${currentStep > step.number ? styles.activeLine : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}