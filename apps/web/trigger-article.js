const http = require('https');

const CRON_SECRET = process.env.CRON_SECRET;
const APP_URL = process.env.APP_URL || 'https://www.novaaetus.com';

const endpoints = [
  '/api/cron/generate-articles',
  '/api/cron/generate-macro',
  '/api/cron/breaking-news',
  '/api/cron/generate-world-news'
];

async function triggerEndpoint(path) {
  return new Promise((resolve, reject) => {
    console.log(`Triggering ${path}...`);
    
    const url = new URL(path, APP_URL);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': CRON_SECRET,
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`Status for ${path}:`, res.statusCode);
        console.log(`Response:`, data);
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(`Error triggering ${path}:`, e.message);
      resolve(); // Continue to next even on error
    });

    req.write(JSON.stringify({}));
    req.end();
  });
}

async function run() {
  if (!CRON_SECRET) {
    console.error('CRON_SECRET environment variable is missing!');
    process.exit(1);
  }

  for (const endpoint of endpoints) {
    await triggerEndpoint(endpoint);
    // Small delay between requests
    await new Promise(r => setTimeout(r, 2000));
  }
}

run();
