import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Role, Notification } from '../types';
import { Avatar } from './ui';
import api from '../lib/api';
import { LogoIcon } from './Logo';

const Icons = {
    Dashboard: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.125 1.125 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>,
    Orgs: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18M18.75 3v18M9 6.75h6.75M9 11.25h6.75M9 15.75h6.75M9 20.25h6.75" /></svg>,
    Jobs: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25V14.15M18.75 18.75v-6.098a2.25 2.25 0 00-2.25-2.25h-3.51a2.25 2.25 0 00-2.25 2.25v6.098M18.75 18.75h-15M12 12.75h.008v.008H12v-.008z" /></svg>,
    Candidates: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.598M12 14.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5z" /></svg>,
    Billing: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3M3.75 5.25h16.5a1.5 1.5 0 011.5 1.5v8.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z" /></svg>,
    Profile: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Applications: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    Logout: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>,
    Menu: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
    Messages: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
    TeamBuilder: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.036-.259a3.375 3.375 0 002.455-2.456L18 13.5z" /></svg>,
    Shortlist: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Contracts: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    Payments: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Calendar: ({className}:{className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>,
    Sun: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>,
    Moon: ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>,
};

const adminNav = [
    { name: 'Dashboard', href: '/admin', icon: Icons.Dashboard },
    { name: 'Organizations', href: '/admin/organizations', icon: Icons.Orgs },
    { name: 'Jobs', href: '/admin/jobs', icon: Icons.Jobs },
    { name: 'Candidates', href: '/admin/candidates', icon: Icons.Candidates },
    { name: 'Shortlist Requests', href: '/admin/shortlist-requests', icon: Icons.Shortlist },
    { name: 'Contracts', href: '/admin/contracts', icon: Icons.Contracts },
    { name: 'Payments', href: '/admin/payments', icon: Icons.Payments },
    { name: 'Messages', href: '/admin/messages', icon: Icons.Messages },
];

const clientNav = [
    { name: 'Dashboard', href: '/client', icon: Icons.Dashboard },
    { name: 'Team Builder', href: '/client/team-builder', icon: Icons.TeamBuilder },
    { name: 'My Shortlists', href: '/client/shortlists', icon: Icons.Shortlist },
    { name: 'Jobs', href: '/client/jobs', icon: Icons.Jobs },
    { name: 'Contracts', href: '/client/contracts', icon: Icons.Contracts },
    { name: 'Payments', href: '/client/payments', icon: Icons.Payments },
    { name: 'Billing', href: '/client/billing', icon: Icons.Billing },
    { name: 'Messages', href: '/client/messages', icon: Icons.Messages },
];

const candidateNav = [
    { name: 'My Profile', href: '/candidate', icon: Icons.Profile },
    { name: 'Find Jobs', href: '/candidate/jobs', icon: Icons.Jobs },
    { name: 'My Applications', href: '/candidate/applications', icon: Icons.Applications },
    { name: 'My Interviews', href: '/candidate/interviews', icon: Icons.Calendar },
    { name: 'Contracts', href: '/candidate/contracts', icon: Icons.Contracts },
    { name: 'Payments', href: '/candidate/payments', icon: Icons.Payments },
    { name: 'Messages', href: '/candidate/messages', icon: Icons.Messages },
];

const NavItem: React.FC<{item: {name: string, href: string, icon: React.FC<{className?:string}>, badgeCount?: number }}> = ({ item }) => {
    const router = useRouter();
    const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
    // Special case for dashboard index pages
    const isDashboard = router.pathname === '/admin' || router.pathname === '/client' || router.pathname === '/candidate';
    const isDashboardLink = item.href === '/admin' || item.href === '/client' || item.href === '/candidate';
    const finalIsActive = isDashboard && isDashboardLink ? (router.pathname === item.href) : isActive;

    return (
        <Link
            href={item.href}
            className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg group ${
                finalIsActive
                    ? 'bg-primary-500/10 text-primary-600 dark:bg-gray-800 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white'
            }`}
        >
            <div className="flex items-center">
                <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${finalIsActive ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'}`}/>
                {item.name}
            </div>
            {item.badgeCount && item.badgeCount > 0 && (
                 <span className="ml-auto inline-block whitespace-nowrap rounded-full bg-primary-500 px-2 py-0.5 text-xs font-bold leading-none text-gray-900">
                    {item.badgeCount}
                </span>
            )}
        </Link>
    );
};

const Sidebar: React.FC<{ navItems: any[] }> = ({ navItems }) => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [pendingRequests, setPendingRequests] = useState(0);

    useEffect(() => {
        if (user?.role === Role.ADMIN) {
            api.getShortlistRequestsForAdmin().then(requests => {
                setPendingRequests(requests.filter((r: any) => r.status === 'Pending').length);
            });
        }
    }, [user, router.asPath]);

    const navItemsWithBadges = navItems.map(item => {
        if (item.name === 'Shortlist Requests' && pendingRequests > 0) {
            return { ...item, badgeCount: pendingRequests };
        }
        return item;
    });
    
    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 pb-4">
            <Link href="/dashboard" className="flex h-16 shrink-0 items-center gap-2">
                <LogoIcon className="h-7 w-auto" />
                <span className="font-bold text-xl text-gray-900 dark:text-gray-100">PlugPlayers</span>
            </Link>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navItemsWithBadges.map((item) => (
                                <li key={item.name}>
                                    <NavItem item={item} />
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="mt-auto -mx-2">
                         <a onClick={logout} className="flex cursor-pointer items-center px-3 py-2 text-sm font-medium rounded-md group text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white">
                           <Icons.Logout className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                            Log out
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="rounded-full p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <Icons.Moon className="h-6 w-6" /> : <Icons.Sun className="h-6 w-6" />}
        </button>
    );
};

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(() => {
    if (user) {
      api.getNotificationsForUser(user.id).then(setNotifications);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await api.markNotificationAsRead(notification.id);
      fetchNotifications();
    }
    setIsOpen(false);
    router.push(notification.link);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={menuRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="relative rounded-full p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none">
        <span className="sr-only">View notifications</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-800">Notifications</div>
          <ul className="max-h-80 overflow-y-auto">
             {notifications.length > 0 ? notifications.map(n => (
                 <li key={n.id} onClick={() => handleNotificationClick(n)} className={`block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${!n.isRead ? 'bg-primary-50 dark:bg-primary-950/50' : ''}`}>
                    <p className="font-medium">{n.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString([], {dateStyle: 'short', timeStyle: 'short'})}</p>
                 </li>
             )) : (
                 <li className="px-4 py-4 text-sm text-center text-gray-500">No notifications</li>
             )}
          </ul>
        </div>
      )}
    </div>
  )
}


interface PortalLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children, pageTitle }) => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    let navItems;
    if (user?.role === Role.ADMIN) navItems = adminNav;
    else if (user?.role === Role.CLIENT_ADMIN || user?.role === Role.CLIENT_MEMBER) navItems = clientNav;
    else if (user?.role === Role.CANDIDATE) navItems = candidateNav;
    else navItems = [];

    return (
        <div>
            {sidebarOpen && (
                <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-900/80"></div>
                    <div className="fixed inset-0 flex">
                        <div className="relative mr-16 flex w-full max-w-xs flex-1">
                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                    <span className="sr-only">Close sidebar</span>
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <Sidebar navItems={navItems} />
                        </div>
                    </div>
                </div>
            )}

            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <Sidebar navItems={navItems} />
            </div>

            <div className="lg:pl-64">
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <span className="sr-only">Open sidebar</span>
                        <Icons.Menu className="h-6 w-6" />
                    </button>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                       <h1 className="flex-1 text-xl font-semibold self-center text-gray-900 dark:text-gray-100">{pageTitle}</h1>
                       <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <ThemeToggle />
                            <NotificationBell />
                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10 dark:lg:bg-gray-100/10" aria-hidden="true"></div>
                            <div className="relative">
                                <span className="sr-only">View profile</span>
                                <div className="flex items-center">
                                    <Avatar src={user?.avatarUrl} name={user?.name} size="sm" />
                                    <div className="ml-3 hidden md:block">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white">{user?.name}</p>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                       </div>
                    </div>
                </div>

                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default PortalLayout;
