import { getHomePageData } from './api/home';

export function createApiHandler() {
  return {
    '/api/home': async () => {
      const data = await getHomePageData();
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  };
}
