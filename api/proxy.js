import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  console.log('Proxy request received');

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });

  try {
    const response = await axios({
      method: 'post',
      url: 'https://152.70.116.73/api/chat',
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      },
      httpsAgent,
      responseType: 'stream'
    });

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Pipe the response stream
    response.data.pipe(res);

  } catch (error) {
    console.error('Proxy error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data
    });
  }
} 