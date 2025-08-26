import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui';
import { LogoIcon } from '../components/Logo';
import { User } from '../types';

// Demo users are now hardcoded here for the login page display only.
const demoUsers: Partial<User>[] = [
    { name: 'Admin User', email: 'admin@plugplayers.com', role: 'ADMIN' },
    { name: 'Alice (Client Admin)', email: 'alice@startup.com', role: 'CLIENT_ADMIN' },
    { name: 'Charlie (Candidate)', email: 'charlie.dev@email.com', role: 'CANDIDATE' },
];

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (selectedEmail: string) => {
    setError('');
    setLoading(true);
    const success = await login(selectedEmail);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('User not found. Please select a demo user or register a new account.');
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
             Or{' '}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                create an account
            </Link>
          </p>
        </div>
        
        {error && <div className="rounded-md bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500/30 p-4"><p className="text-sm text-red-800 dark:text-red-200">{error}</p></div>}

        <Card>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Sign in with a Demo User</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">No password needed. Just click to log in.</p>
            <div className="mt-6 space-y-4">
                {demoUsers.map(user => (
                    <button
                        key={user.email}
                        onClick={() => handleLogin(user.email!)}
                        disabled={loading}
                        className="w-full flex items-center justify-between text-left p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition disabled:opacity-50"
                    >
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        <div className="text-sm font-medium text-primary-600 dark:text-primary-400 capitalize">{user.role!.toLowerCase().replace('_', ' ')}</div>
                    </button>
                ))}
            </div>
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

export default LoginPage;
