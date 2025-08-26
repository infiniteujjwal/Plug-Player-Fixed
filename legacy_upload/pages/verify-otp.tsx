import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Label, Card } from '../components/ui';
import { LogoIcon } from '../components/Logo';

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { verifyAndLogin } = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  
  useEffect(() => {
      if (router.isReady) {
          const emailFromQuery = router.query.email;
          if (typeof emailFromQuery === 'string') {
              setEmail(emailFromQuery);
          } else {
              router.replace('/register');
          }
      }
  }, [router.isReady, router.query, router]);

  if (!email) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
            Loading...
        </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
        setError('Please enter a 6-digit OTP.');
        return;
    }
    setLoading(true);
    const result = await verifyAndLogin(email, otp);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };
  
  const handleResend = () => {
      alert("In a real app, a new OTP would be sent. For this demo, please use '123456'.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
           <Link href="/" className="mx-auto h-12 w-auto flex items-center justify-center gap-2">
                <LogoIcon className="h-8 w-auto" />
                <span className="font-bold text-2xl text-gray-900 dark:text-gray-100">PlugPlayers</span>
            </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Verify your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            We've sent a 6-digit OTP to <span className="font-medium text-gray-800 dark:text-gray-200">{email}</span>.
             For this demo, the code is <span className="font-bold text-primary-600 dark:text-primary-400">123456</span>.
          </p>
        </div>
        
        <Card>
            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && <div className="rounded-md bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500/30 p-4"><p className="text-sm text-red-800 dark:text-red-200">{error}</p></div>}
                
                <div>
                    <Label htmlFor="otp">One-Time Password (OTP)</Label>
                    <Input 
                        id="otp" 
                        name="otp" 
                        type="text" 
                        maxLength={6}
                        required 
                        value={otp} 
                        onChange={e => setOtp(e.target.value)} 
                        className="text-center tracking-[0.5em] text-lg"
                        autoComplete="one-time-code"
                    />
                </div>

                <div>
                    <Button type="submit" className="w-full" disabled={loading} size="lg">
                        {loading ? 'Verifying...' : 'Verify Account'}
                    </Button>
                </div>
            </form>
        </Card>
        
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Didn't receive the code?{' '}
            <button onClick={handleResend} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Resend
            </button>
        </p>

      </div>
    </div>
  );
};

export default OtpPage;
