const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiter (per-instance). Limits abusive bursts from a single IP.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateMap = new Map<string, { count: number; reset: number }>();

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || entry.reset < now) {
    rateMap.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
};

// Sanitize a value going into Google Sheets:
// - coerce to string, trim
// - cap length
// - neutralize formula-trigger leading chars (=, +, -, @, tab, CR) by prefixing a single quote
const MAX_FIELD_LEN = 500;
const sanitizeCell = (val: unknown): string => {
  let s = (val === null || val === undefined) ? '' : String(val);
  if (s.length > MAX_FIELD_LEN) s = s.slice(0, MAX_FIELD_LEN);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
};

const createJWT = async (serviceAccount: { client_email: string; private_key: string }) => {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const headerB64 = encode(header);
  const payloadB64 = encode(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  const pemContents = serviceAccount.private_key
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\\n/g, '')
    .replace(/\n/g, '');
  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${signingInput}.${sigB64}`;
};

const getAccessToken = async (serviceAccount: { client_email: string; private_key: string }) => {
  const jwt = await createJWT(serviceAccount);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!res.ok) {
    // Log full detail server-side; do not surface to client.
    console.error('OAuth token error:', JSON.stringify(data));
    throw new Error('oauth_token_failed');
  }
  return data.access_token as string;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Basic per-IP rate limiting
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      });
    }

    const saJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
    if (!saJson) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not configured');

    const spreadsheetId = Deno.env.get('GOOGLE_SPREADSHEET_ID');
    if (!spreadsheetId) throw new Error('GOOGLE_SPREADSHEET_ID not configured');

    const serviceAccount = JSON.parse(saJson);
    const body = await req.json();

    const {
      nome = '',
      telefone = '',
      porteEmpresa = '',
      planoAtual = '',
      faixasEtarias = {},
      hospitais = '',
      doencas = '',
      utm_source = '',
      utm_medium = '',
      utm_campaign = '',
      utm_term = '',
      utm_content = '',
      utm_id = '',
      gclid = '',
    } = body;

    const faixasStr = Object.entries(faixasEtarias as Record<string, number>)
      .filter(([_, count]) => count > 0)
      .map(([faixa, count]) => `${faixa}: ${count}`)
      .join(', ') || '';

    const totalVidas = Object.values(faixasEtarias as Record<string, number>).reduce(
      (sum: number, count: number) => sum + Number(count || 0),
      0
    );

    const conversaoParts: string[] = [];
    if (totalVidas > 0) conversaoParts.push(`Vidas: ${totalVidas} (${faixasStr})`);
    if (hospitais) conversaoParts.push(`Hospitais: ${hospitais}`);
    if (doencas) conversaoParts.push(`Doenças: ${doencas}`);
    const conversao = conversaoParts.join(' | ') || '';

    const now = new Date();
    const data = now.toLocaleDateString('pt-BR');
    const horario = now.toLocaleTimeString('pt-BR');

    const row = [
      nome,
      telefone,
      porteEmpresa,
      conversao,
      utm_campaign,
      utm_term,
      planoAtual,
      data,
      horario,
      gclid,
    ].map(sanitizeCell);

    const accessToken = await getAccessToken(serviceAccount);

    // Use RAW to prevent Sheets from interpreting any cell as a formula.
    const sheetsRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/P%C3%A1gina1!A:J:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [row] }),
      }
    );

    if (!sheetsRes.ok) {
      const sheetsData = await sheetsRes.text();
      console.error(`Sheets API error [${sheetsRes.status}]:`, sheetsData);
      throw new Error('sheets_write_failed');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    // Log full details server-side, return generic message to client.
    console.error('send-to-sheets error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
