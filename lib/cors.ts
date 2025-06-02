import { NextApiRequest, NextApiResponse } from 'next';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3003',
  'https://your-production-domain.com'
];

export function cors(req: NextApiRequest, res: NextApiResponse, options: { methods?: string[] } = {}) {
  const { methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] } = options;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Check origin
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // Allowed methods
  res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
  
  // Allowed headers
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}

export function withCors(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (cors(req, res)) return;
    await handler(req, res);
  };
}
