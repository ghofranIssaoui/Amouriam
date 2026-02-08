'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TwoFactorVerification } from '@/components/TwoFactorVerification';
import { Loader2 } from 'lucide-react';

export default function Verify2FAClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    // If 2FA is not required, redirect to the callback URL
    if (status === 'authenticated' && !session?.user?.is2FARequired) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  if (status === 'loading' || (status === 'authenticated' && !session?.user?.is2FARequired)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session?.user?.id) {
    return null; // Will be redirected by the effect
  }

  const handleSuccess = () => {
    router.push(callbackUrl);
  };

  const handleBack = () => {
    router.push('/auth/login');
  };

  return (
    <div className="container max-w-md py-12">
      <TwoFactorVerification
        userId={session.user.id}
        email={session.user.email || ''}
        onSuccess={handleSuccess}
        onBack={handleBack}
      />
    </div>
  );
}
