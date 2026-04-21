import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { extname, join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const filePath = join(__dirname, urlPath === '/' ? 'index.html' : urlPath);

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.writeHead(404); res.end('Not found');
    return;
  }

  const ext = extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': mime[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(readFileSync(filePath));
}).listen(PORT, () => console.log(`Rodeo Realty → http://localhost:${PORT}`));
