import fetch from 'node-fetch';
import https from 'https';

export default async function handler(req, res) {
  console.log('Proxy request received:', req.body);
  
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  try {
    const response = await fetch('https://152.70.116.73/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      agent: agent
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    console.log('Response data:', data.slice(0, 100)); // Log first 100 chars

    res.status(200).send(data);
  } catch (error) {
    console.error('Proxy error details:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
} 