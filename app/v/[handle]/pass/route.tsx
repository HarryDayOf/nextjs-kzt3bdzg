import { ImageResponse } from 'next/og';
import { getVendor, FOUNDING_CAP } from '@/lib/foundingVendors';
import { Pass, PASS_W, PASS_H } from '../Pass';

export const dynamic = 'force-dynamic';

// GET /v/[handle]/pass — renders the Instagram-Story-sized founding pass (PNG).
export async function GET(_req: Request, { params }: { params: { handle: string } }) {
  const vendor = getVendor(params.handle);
  if (!vendor) return new Response('Vendor not found', { status: 404 });

  return new ImageResponse(<Pass vendor={vendor} total={FOUNDING_CAP} />, {
    width: PASS_W,
    height: PASS_H,
  });
}
