export default async function handler(req, res) {
  console.log('Proxy request received');
  try {
    console.log('Making request to Oracle server...');
    const response = await fetch('https://152.70.116.73/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      agent: new (require('https').Agent)({
        rejectUnauthorized: false
      })
    });

    console.log('Response received from Oracle server');
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    response.body.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
} 