const http = require('http');

const data = JSON.stringify({});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/cron/generate-articles',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-cron-secret': process.env.CRON_SECRET,
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', chunk => process.stdout.write(chunk));
});

req.on('error', (e) => console.error('Error:', e.message));

req.write(data);
req.end();
