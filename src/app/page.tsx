
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">PlugPlayers</h1>
      <p className="mb-6">Role-based portals for Admin, Client, and Jobseeker.</p>
      <ul className="space-y-2">
        <li><Link href="/signin">Sign in</Link></li>
        <li><Link href="/admin">Admin</Link></li>
        <li><Link href="/client">Client</Link></li>
        <li><Link href="/jobseeker">Jobseeker</Link></li>
      </ul>
    </div>
  );
}
