const http = require('http');
const { exec } = require('child_process');

const PORT = 8080;
const SCRIPT_PATH = './t/test-end_to_end.sh';

const server = http.createServer((req, res) => {
  // 1. Check if the request is a POST and to the correct URL
  if (req.method === 'POST' && req.url === '/execute') {
    console.log(`Execution triggered at ${new Date().toISOString()}`);

    // 2. Execute the shell script
    exec(`sh ${SCRIPT_PATH}`, (error, stdout, stderr) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });

      if (error) {
        console.error(`Error: ${error.message}`);
        return res.end(JSON.stringify({ status: 'error', message: error.message }));
      }

      // 3. Send the script's output back to the requester
      res.end(JSON.stringify({
        status: 'success',
        output: stdout.trim(),
        errors: stderr.trim(),
      }));
    });
  } else {
    // Handle unknown routes or methods
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found. Please use POST /execute');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}/`);
  console.log(`To trigger: curl -X POST http://<YOUR-EC2-IP>:${PORT}/execute`);
});
