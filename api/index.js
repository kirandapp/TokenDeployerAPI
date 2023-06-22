const { createServer } = require('http');
const { parse } = require('url');
const { join } = require('path');
const { existsSync } = require('fs');

const app = require('./api/app');

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;

  // Serve static files from 'public' directory
  const publicPath = join(__dirname, 'public', pathname);
  if (existsSync(publicPath)) {
    app.serveStatic(req, res, publicPath);
  } else {
    app.default(req, res);
  }
});

const port = process.env.PORT || 3000;

server.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server listening on port ${port}`);
});
