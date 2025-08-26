import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

const DashboardRedirectPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case Role.ADMIN:
          router.replace('/admin');
          break;
        case Role.CLIENT_ADMIN:
        case Role.CLIENT_MEMBER:
          router.replace('/client');
          break;
        case Role.CANDIDATE:
          router.replace('/candidate');
          break;
        default:
          router.replace('/login');
          break;
      }
    } else if (!loading && !user) {
        router.replace('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-black">
      <div className="text-center">
        <p className="text-lg text-gray-700 dark:text-gray-300">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardRedirectPage;
