import https from 'https';

export default async function handler(req, res) {
  console.log('Proxy request received');

  const options = {
    hostname: '152.70.116.73',
    port: 443,
    path: '/api/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    rejectUnauthorized: false
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    proxyRes.on('data', (chunk) => {
      res.write(chunk);
    });

    proxyRes.on('end', () => {
      res.end();
    });
  });

  proxyReq.on('error', (error) => {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  });

  // Write the request body
  proxyReq.write(JSON.stringify(req.body));
  proxyReq.end();
} 