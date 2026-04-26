'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const [email, setEmail] = useState<string>('');
  const [tier, setTier] = useState<string>('free');

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setEmail(userData.user?.email ?? 'Not signed in');
      if (userData.user) {
        const { data } = await supabase.from('profiles').select('subscription_tier').eq('id', userData.user.id).single();
        setTier(data?.subscription_tier ?? 'free');
      }
    };
    void load();
  }, []);

  return (
    <main className="container" style={{ paddingBottom: '3rem' }}>
      <div className="card" style={{ maxWidth: 520 }}>
        <h1>Account</h1>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Plan:</strong> {tier.toUpperCase()}</p>
      </div>
    </main>
  );
}
