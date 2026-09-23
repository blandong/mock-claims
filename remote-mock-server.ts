/**
 * Cloudflare Worker that serves the remote claim mock.
 *
 * Endpoints:
 *
 * GET  /claims?code=claim12
 *      Returns claim data.
 *
 * POST /claims/move
 *      {
 *        "oldCode": "claim12",
 *        "newCode": "claim99"
 *      }
 *
 * POST /claims/reset
 *      Clears all moved-claim state.
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

// oldCode -> newCode
const movedClaims = new Map<string, string>();

export async function handleRequest(
  request: Request,
): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '') || '/';

  // ------------------------------------------------------------
  // GET /claims?code=claim12
  // ------------------------------------------------------------
  if (pathname === '/claims' && request.method === 'GET') {
    const parentCode =
      url.searchParams.get('code') ?? CLAIM_RESPONSE.parentCode;

    // Old claim has been moved, so return no data.
    if (movedClaims.has(parentCode)) {
      return new Response(null, {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        ...CLAIM_RESPONSE,
        parentCode,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': CLAIM_CONTENT_TYPE,
        },
      },
    );
  }

  // ------------------------------------------------------------
  // POST /claims/move
  // ------------------------------------------------------------
  if (pathname === '/claims/move' && request.method === 'POST') {
    return moveClaim(request);
  }

  // ------------------------------------------------------------
  // POST /claims/reset
  // ------------------------------------------------------------
  if (pathname === '/claims/reset' && request.method === 'POST') {
    movedClaims.clear();

    return new Response(
      JSON.stringify({
        reset: true,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  // ------------------------------------------------------------
  // Unknown endpoint
  // ------------------------------------------------------------
  return new Response(
    JSON.stringify({
      error: 'not found',
    }),
    {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

/**
 * Move a claim.
 *
 * POST /claims/move
 *
 * Body:
 * {
 *   "oldCode": "claim12",
 *   "newCode": "claim99"
 * }
 */
async function moveClaim(request: Request): Promise<Response> {
  let body: {
    oldCode?: string;
    newCode?: string;
  };

  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({
        error: 'invalid JSON',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  const { oldCode, newCode } = body;

  if (!oldCode || !newCode) {
    return new Response(
      JSON.stringify({
        error: 'oldCode and newCode are required',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  movedClaims.set(oldCode, newCode);

  return new Response(
    JSON.stringify({
      oldCode,
      newCode,
      moved: true,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

export default {
  fetch: handleRequest,
} satisfies ExportedHandler;

