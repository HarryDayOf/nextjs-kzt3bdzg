import { notFound } from 'next/navigation';
import SupportConsole from '../../../components/console/SupportConsole';

const ROLE_USERS: Record<string, { name: string; role: any }> = {
  admin:      { name: 'Harry McLaughlin', role: 'admin' },
  cs:         { name: 'Genner Castillo',  role: 'cs' },
  moderation: { name: 'Moderation Team', role: 'moderation' },
  leadership: { name: 'Haines',          role: 'leadership' },
  readonly:   { name: 'Fabeha',          role: 'readonly' },
};

export default function DemoPage({ params }: { params: { role: string } }) {
  const user = ROLE_USERS[params.role];
  if (!user) notFound();
  return <SupportConsole user={user} />;
}

export function generateStaticParams() {
  return Object.keys(ROLE_USERS).map(role => ({ role }));
}
