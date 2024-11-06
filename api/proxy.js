import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  console.log('Proxy request received');

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    timeout: 60000  // 60 seconds timeout
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
      responseType: 'stream',
      timeout: 60000  // 60 seconds timeout
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

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