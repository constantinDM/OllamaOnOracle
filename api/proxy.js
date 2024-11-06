export default async function handler(req, res) {
  try {
    const response = await fetch('https://152.70.116.73/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();
    res.setHeader('Content-Type', 'text/event-stream');
    res.write(data);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 