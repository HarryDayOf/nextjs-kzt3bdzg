import { notFound } from 'next/navigation';
import { getVendor, claimedCount, recruitCount, FOUNDING_CAP } from '@/lib/foundingVendors';
import VendorPage from './VendorPage';

export const dynamic = 'force-dynamic';

export default function Page({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams: { invite?: string };
}) {
  const vendor = getVendor(params.handle);
  if (!vendor) notFound();

  const inviter = vendor.invitedByHandle ? getVendor(vendor.invitedByHandle) : null;

  const invites = vendor.inviteCodes.map(c => {
    const claimer = c.claimedByHandle ? getVendor(c.claimedByHandle) : null;
    return {
      code: c.code,
      claimedByName: claimer?.name ?? c.claimedByHandle ?? null,
      claimed: !!c.claimedByHandle,
    };
  });

  return (
    <VendorPage
      vendor={vendor}
      inviterName={inviter?.name ?? null}
      invites={invites}
      recruited={recruitCount(vendor.handle)}
      claimed={claimedCount()}
      cap={FOUNDING_CAP}
      prefillCode={searchParams.invite ?? ''}
    />
  );
}
