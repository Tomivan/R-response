import { Suspense } from 'react';
import SetNewPassword from '../components/auth/set-new-password/setNewPassword';

export default function SetNewPasswordRoute() {
  return (
    <Suspense fallback={<div className="loading-state">Loading...</div>}>
      <SetNewPassword />
    </Suspense>
  )
}