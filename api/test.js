// Simple test API endpoint to verify API is working
export default async function handler(req, res) {
  // Enable CORS with specific configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('Test API called:', req.method, req.url);

  try {
    const response = {
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      url: req.url,
      method: req.method,
      headers: {
        origin: req.headers.origin,
        host: req.headers.host,
        userAgent: req.headers['user-agent']
      }
    };

    console.log('Test API response:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({ error: 'Test API failed', details: error.message });
  }
}