import express from 'express';
import { render } from './src/entry-server.js';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

async function createSSRServer() {
  const app = express();

  let vite;
  if (!isProduction) {
    // Development mode - use Vite middleware
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: __dirname,
    });
    app.use(vite.ssrLoadModule);
  } else {
    // Production mode - serve static files
    app.use(express.static(join(__dirname, 'dist/client')));
  }

  // API routes
  app.use('/api', (req, res, next) => {
    // Proxy API requests to the API server
    const apiUrl = `http://localhost:3002${req.originalUrl}`;
    fetch(apiUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    })
      .then(response => response.json())
      .then(data => res.json(data))
      .catch(error => {
        console.error('API proxy error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  });

  // SSR route handler
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      
      let template;
      let render;
      
      if (!isProduction) {
        // Development mode
        template = await vite.transformIndexHtml(url, `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <link rel="icon" type="image/svg+xml" href="/vite.svg" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>VNCompare - So sánh sơn và vật liệu xây dựng tại Việt Nam</title>
              <meta name="description" content="Nền tảng so sánh sơn hàng đầu Việt Nam. Tìm kiếm, so sánh giá và mua sơn chất lượng cao từ các nhà cung cấp uy tín." />
              <meta name="keywords" content="sơn, vật liệu xây dựng, so sánh giá, mua sơn, sơn chất lượng cao, Việt Nam" />
            </head>
            <body>
              <div id="root" data-ssr><!--ssr-outlet--></div>
              <script type="module" src="/src/entry-client.tsx"></script>
            </body>
          </html>
        `);
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        // Production mode
        template = await import('./dist/server/template.html');
        render = (await import('./dist/server/entry-server.js')).render;
      }

      const { html: appHtml } = await render(url);
      
      const html = template.replace('<!--ssr-outlet-->', appHtml);
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (error) {
      console.error('SSR Error:', error);
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(error);
      }
      res.status(500).end(error.message);
    }
  });

  app.listen(port, () => {
    console.log(`🚀 SSR Server running on port ${port}`);
    console.log(`📦 Mode: ${isProduction ? 'production' : 'development'}`);
  });
}

createSSRServer().catch(console.error);
