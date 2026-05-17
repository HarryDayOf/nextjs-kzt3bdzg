'use server';

import { claimInvite } from '@/lib/foundingVendors';

export interface ClaimActionResult {
  ok: boolean;
  handle?: string;
  error?: string;
}

// Server action: redeem an invite code and create a new founding vendor.
export async function claimAction(input: {
  code: string;
  name: string;
  craft: string;
  city: string;
  state: string;
}): Promise<ClaimActionResult> {
  const result = claimInvite(input);
  if (result.ok && result.vendor) return { ok: true, handle: result.vendor.handle };
  return { ok: false, error: result.error };
}
