
import { auth } from '@/lib/auth';

export default async function ClientPage() {
  const session = await auth();
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Client Portal</h2>
      <p>User: {session?.user?.email}</p>
      <ul className="mt-4 list-disc pl-5">
        <li>Post roles</li>
        <li>Review candidates</li>
        <li>Track interviews</li>
      </ul>
    </div>
  );
}
