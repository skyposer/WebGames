const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 19178;
const HOST = '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const COMPRESSIBLE = ['.html', '.css', '.js'];
const IMAGE_EXTS = ['.jpeg', '.jpg', '.png', '.gif'];

function resolveFile(filePath, acceptEncoding) {
  const ext = path.extname(filePath);
  if (IMAGE_EXTS.includes(ext) && acceptEncoding && acceptEncoding.includes('webp')) {
    const webpPath = filePath.replace(ext, '.webp');
    try {
      if (fs.existsSync(webpPath)) {
        return { path: webpPath, contentType: 'image/webp', original: filePath };
      }
    } catch (e) {}
  }
  return { path: filePath, contentType: MIME[ext] || 'application/octet-stream', original: null };
}

function getFileMtime(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return Math.floor(stat.mtimeMs);
  } catch (e) {
    return Date.now();
  }
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = '.' + (urlPath === '/' ? '/index.html' : urlPath);
  const ext = path.extname(filePath);
  const isHTML = ext === '.html';
  const accept = req.headers['accept'] || '';

  const resolved = resolveFile(filePath, accept);
  const contentType = resolved.contentType;
  const servePath = resolved.path;

  fs.stat(servePath, (err, stat) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const etag = '"' + stat.size + '-' + Math.floor(stat.mtimeMs) + '"';
    const lastModified = stat.mtime.toUTCString();
    const cacheControl = isHTML
      ? 'no-store'
      : IMAGE_EXTS.includes(ext) || ext === '.webp'
        ? 'public, max-age=86400, must-revalidate'
        : 'no-cache';

    if (req.headers['if-none-match'] === etag || req.headers['if-modified-since'] === lastModified) {
      res.writeHead(304);
      res.end();
      return;
    }

    fs.readFile(servePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }

      let output = data;

      if (isHTML) {
        const cssMtime = getFileMtime('./style.css');
        const jsMtime = getFileMtime('./script.js');
        let html = data.toString('utf-8');
        html = html.replace(/style\.css\?v=\d+/g, 'style.css?v=' + cssMtime);
        html = html.replace(/script\.js\?v=\d+/g, 'script.js?v=' + jsMtime);
        output = Buffer.from(html, 'utf-8');
      }

      const headers = {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'ETag': etag,
        'Last-Modified': lastModified,
        'Accept-Ranges': 'bytes',
      };

      if (req.method === 'HEAD') {
        res.writeHead(200, headers);
        res.end();
        return;
      }

      const useGzip = COMPRESSIBLE.includes(ext) && req.headers['accept-encoding'] && req.headers['accept-encoding'].includes('gzip');

      if (useGzip) {
        headers['Content-Encoding'] = 'gzip';
        res.writeHead(200, headers);
        zlib.gzip(output, (err, compressed) => {
          if (err) { res.end(output); return; }
          res.end(compressed);
        });
      } else {
        res.writeHead(200, headers);
        res.end(output);
      }
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`ECG-12 模拟器已启动: http://localhost:${PORT}`);
});
