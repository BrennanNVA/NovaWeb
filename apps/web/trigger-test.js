const https = require('https');

const CRON_SECRET = 'M7BibyKPBHkmrUID1XRrMQTFp3N+GvQOQZr56xfKlF=';
const ENDPOINTS = [
  '/api/cron/generate-articles',
  '/api/cron/generate-world-news',
  '/api/cron/generate-macro',
  '/api/cron/breaking-news'
];

async function testEndpoint(path, useAuthHeader = false) {
  return new Promise((resolve) => {
    const headerName = useAuthHeader ? 'Authorization' : 'x-cron-secret';
    const headerValue = useAuthHeader ? `Bearer ${CRON_SECRET}` : CRON_SECRET;
    
    console.log(`Testing ${path} with ${headerName}...`);
    const options = {
      hostname: 'www.novaaetus.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        [headerName]: headerValue,
        'Content-Length': 0
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          body: data
        });
      });
    });

    req.on('error', (e) => {
      resolve({
        path,
        error: e.message
      });
    });

    req.end();
  });
}

async function runTests() {
  for (const endpoint of ENDPOINTS) {
    const resultX = await testEndpoint(endpoint, false);
    console.log(`Result (x-cron-secret) for ${resultX.path}:`, resultX.status, resultX.body || resultX.error);
    
    const resultA = await testEndpoint(endpoint, true);
    console.log(`Result (Authorization) for ${resultA.path}:`, resultA.status, resultA.body || resultA.error);
  }
}

runTests();
