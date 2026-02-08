import { Suspense } from 'react';
import Verify2FAClient from './client';

export const dynamic = 'force-dynamic';

export default function Verify2FAPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Verify2FAClient />
    </Suspense>
  );
}
