import type { Plugin } from 'vite';
import { getHomePageData } from './src/api/home';

export function apiPlugin(): Plugin {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/home', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const data = await getHomePageData();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        } else {
          next();
        }
      });
    },
  };
}
