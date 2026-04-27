'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/dashboard` } });
    setMessage(error ? error.message : 'Check your email for the magic link.');
  };

  return (
    <main className="container" style={{ maxWidth: 480, paddingBottom: '3rem' }}>
      <form className="card" onSubmit={signIn}>
        <h1>Email Login</h1>
        <input className="btn" style={{ width: '100%' }} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="btn brand" style={{ marginTop: '.8rem' }} type="submit">Send Magic Link</button>
        <p style={{ color: 'var(--muted)' }}>{message}</p>
      </form>
    </main>
  );
}
