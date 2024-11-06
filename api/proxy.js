import axios from 'axios';
import https from 'https';

export default async function handler(req, res) {
  console.log('Proxy request received with body:', req.body);

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    timeout: 60000
  });

  try {
    console.log('Making request to Oracle server...');
    
    const response = await axios({
      method: 'post',
      url: 'https://152.70.116.73/api/chat',
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      },
      httpsAgent,
      timeout: 60000
    });

    console.log('Response received:', response.status);
    console.log('Response headers:', response.headers);

    // Send response directly without streaming
    res.status(200).json(response.data);

  } catch (error) {
    console.error('Detailed proxy error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: error.message,
      details: {
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      }
    });
  }
} 