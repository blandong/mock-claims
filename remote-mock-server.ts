/**
 * Cloudflare Worker that serves the remote claim mock.
 *
 * Deploy with `npm run deploy`. Wrangler's local dev server exposes the same
 * endpoint at http://localhost:8787/claims.
 */

const CLAIM_RESPONSE = {
  parentCode: 'claim12',
  name: 'CO LLC',
  metadata: {
    address1: 'ONE CAMPUS MARTIUS',
    address2: '',
    address3: '',
    city: 'DETROIT',
    state: 'MI',
    postalCode: '48226',
    countryCode: 'US',
  },
  locations: [
    {
      code: '2149',
      name: 'CO LLC',
      metadata: {
        address1: 'ONE CAMPUS MARTIUS',
        address2: '',
        address3: '',
        city: 'DETROIT',
        state: 'MI',
        postalCode: '48226',
        countryCode: 'US',
      },
    },
  ],
};

const CLAIM_CONTENT_TYPE =
  'application/vnd.com.covisint.platform.package.claim.v1+json';

/**
 * Handle a claim request. The `code` query parameter becomes `parentCode`;
 * requests without it use the demo value `claim12`.
 */
export function handleRequest(request: Request): Response {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '') || '/';

  if (pathname !== '/claims' || request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const parentCode = url.searchParams.get('code') ?? CLAIM_RESPONSE.parentCode;
  return new Response(JSON.stringify({ ...CLAIM_RESPONSE, parentCode }), {
    headers: { 'Content-Type': CLAIM_CONTENT_TYPE },
  });
}

export default { fetch: handleRequest } satisfies ExportedHandler;
