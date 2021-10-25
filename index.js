const http = require('http');

const hostname = 'localhost';
const port = 5000;

const server = http.createServer((request, response) => {
  console.log(`The client requested ${request.url}...`);
});

server.listen(port, hostname, () => {
  console.log(`We're live on port ${port}!`);
});