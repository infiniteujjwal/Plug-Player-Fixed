
import { auth } from '@/lib/auth';

export default async function AdminPage() {
  const session = await auth();
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Admin Console</h2>
      <p>User: {session?.user?.email}</p>
      <ul className="mt-4 list-disc pl-5">
        <li>Manage clients and jobseekers</li>
        <li>Review jobs</li>
        <li>Platform settings</li>
      </ul>
    </div>
  );
}
