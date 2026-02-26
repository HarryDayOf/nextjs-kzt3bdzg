'use client';
import { useEffect, useState } from 'react';
import SupportConsole from '../../components/console/SupportConsole';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('dayof_user');
    if (!stored) {
      window.location.href = '/';
    } else {
      setUser(JSON.parse(stored));
    }
    setChecked(true);
  }, []);

  if (!checked || !user) return null;
  return <SupportConsole user={user} />;
}
