import { readFileSync } from 'fs';
import { createSecureServer } from 'http2';

const options = {
  key: readFileSync('localhost.key'),
  cert: readFileSync('localhost.crt'),
};

const server = createSecureServer(options, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const stream = res.stream;

    const interval = setInterval(() => {
      const message = { message: `Hello, World! ${Date.now()}` };

      stream.write(`data: ${JSON.stringify(message)}\n\n`);
    }, 2000);

    stream.on('close', () => {
      console.log('Stream is closed');
      clearInterval(interval);
      res.end();
    });

    stream.on('error', (err) => {
      console.error(err);
      clearInterval(interval);
      res.end();
    });
  } else if (req.method === 'POST') {
    let body = '';

    if (req.method === 'POST') {
      req.on('data', (chunk) => {
        body += chunk;
      });
    }

    req.on('end', () => {
      try {
        console.log('Client data:', body);

        const receivedData = JSON.parse(body || '{}');
        console.log('Client data:', receivedData);
      } catch (error) {
        console.error('Error JSON:', error);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('JSON invalid');
      }
    });
  }
});

server.listen(3000, () => {
  console.log('Server running at https://localhost:3000/');
});
