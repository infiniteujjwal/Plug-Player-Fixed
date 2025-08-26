import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { Button, Input, Label, Select, Card } from '../components/ui';
import { LogoIcon } from '../components/Logo';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>(Role.CANDIDATE);
  const [orgName, setOrgName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (role === Role.CLIENT_ADMIN && !orgName) {
        setError('Organization name is required for client accounts.');
        return;
    }

    setLoading(true);
    const result = await register({ name, email, role, orgName: role === Role.CLIENT_ADMIN ? orgName : undefined });
    if (result.success) {
      router.push({
          pathname: '/verify-otp',
          query: { email },
      });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
           <Link href="/" className="mx-auto h-12 w-auto flex items-center justify-center gap-2">
                <LogoIcon className="h-8 w-auto" />
                <span className="font-bold text-2xl text-gray-900 dark:text-gray-100">PlugPlayers</span>
            </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
             Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Sign in
            </Link>
          </p>
        </div>
        
        <Card>
            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && <div className="rounded-md bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500/30 p-4"><p className="text-sm text-red-800 dark:text-red-200">{error}</p></div>}
                
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" type="text" required value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div>
                    <Label htmlFor="role">I am a...</Label>
                    <Select id="role" name="role" value={role} onChange={e => setRole(e.target.value as Role)}>
                        <option value={Role.CANDIDATE}>Candidate (Looking for a job)</option>
                        <option value={Role.CLIENT_ADMIN}>Client (Looking to hire)</option>
                    </Select>
                </div>

                {role === Role.CLIENT_ADMIN && (
                     <div>
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input id="orgName" name="orgName" type="text" required={role === Role.CLIENT_ADMIN} value={orgName} onChange={e => setOrgName(e.target.value)} />
                    </div>
                )}
                
                <div>
                    <Button type="submit" className="w-full" disabled={loading} size="lg">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </div>
            </form>
        </Card>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            &larr; Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
