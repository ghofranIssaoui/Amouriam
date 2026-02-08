'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface TwoFactorVerificationProps {
  userId: string;
  email: string;
  onSuccess?: () => void;
  onBack?: () => void;
}

export function TwoFactorVerification({ 
  userId, 
  email, 
  onSuccess,
  onBack 
}: TwoFactorVerificationProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a valid 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      toast({
        title: 'Success',
        description: 'Successfully verified your identity',
      });

      if (onSuccess) {
        onSuccess();
      } else {
        // Default behavior: redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('2FA verification error:', error);
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'Failed to verify code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
        <p className="text-muted-foreground mt-2">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="123456"
            value={code}
            onChange={(e) => {
              // Only allow numbers and limit to 6 digits
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(value);
            }}
            className="text-center text-xl tracking-widest h-14"
            autoComplete="one-time-code"
            autoFocus
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
          
          {onBack && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              disabled={isLoading}
              className="w-full"
            >
              Back to Login
            </Button>
          )}
        </div>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        <p>Having trouble? Try scanning the QR code again or contact support.</p>
      </div>
    </div>
  );
}
