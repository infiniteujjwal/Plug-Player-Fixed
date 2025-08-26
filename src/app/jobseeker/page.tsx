
import { auth } from '@/lib/auth';

export default async function JobseekerPage() {
  const session = await auth();
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Jobseeker Portal</h2>
      <p>User: {session?.user?.email}</p>
      <ul className="mt-4 list-disc pl-5">
        <li>Create profile</li>
        <li>Apply to roles</li>
        <li>Interview schedule</li>
      </ul>
    </div>
  );
}
