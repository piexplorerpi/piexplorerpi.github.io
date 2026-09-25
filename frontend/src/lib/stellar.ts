/**
 * Stellar / Horizon helper stubs for Pi Explorer account view.
 * These are lightweight placeholders so the frontend builds without the full
 * stellar-sdk dependency. Replace with real Horizon calls when needed.
 */

export interface AccountData {
  id: string;
  sequence: string;
  balances: Array<{
    balance: string;
    asset_type: string;
    asset_code?: string;
    asset_issuer?: string;
  }>;
  signers: Array<{
    key: string;
    weight: number;
    type: string;
  }>;
}

/**
 * Fetch account details. Currently returns a safe mock when Horizon is unavailable.
 */
export async function getAccount(accountId: string): Promise<AccountData> {
  if (!accountId || typeof accountId !== 'string') {
    throw new Error('Invalid account id');
  }

  // Optional: try a public Horizon endpoint if online
  try {
    const horizon =
      (typeof import.meta !== 'undefined' &&
        (import.meta as any).env?.VITE_STELLAR_HORIZON_URL) ||
      'https://horizon.stellar.org';
    const res = await fetch(`${horizon}/accounts/${encodeURIComponent(accountId)}`);
    if (res.ok) {
      const data = await res.json();
      return {
        id: data.id || accountId,
        sequence: String(data.sequence ?? '0'),
        balances: Array.isArray(data.balances) ? data.balances : [],
        signers: Array.isArray(data.signers) ? data.signers : [],
      };
    }
  } catch {
    // fall through to mock
  }

  // Mock fallback so UI can still render during development / offline
  return {
    id: accountId,
    sequence: '0',
    balances: [{ balance: '0', asset_type: 'native' }],
    signers: [{ key: accountId, weight: 1, type: 'ed25519_public_key' }],
  };
}
