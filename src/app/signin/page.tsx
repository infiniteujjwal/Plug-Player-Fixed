
'use client';
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState('admin@plugplayers.dev');
  const [password, setPassword] = useState('admin123');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await signIn('credentials', { email, password, callbackUrl: '/' });
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input className="p-2 rounded w-full" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input className="p-2 rounded w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="px-4 py-2 rounded bg-white" type="submit">Sign in</button>
      </form>
      <p className="mt-4 text-sm opacity-80">Demo users: admin@plugplayers.dev / admin123, client@plugplayers.dev / client123, job@plugplayers.dev / job123</p>
    </div>
  );
}
