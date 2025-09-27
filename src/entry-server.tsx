import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { createServerRouter } from './routes.config';
import App from './App';

export function render(url: string) {
  const router = createServerRouter([url]);
  
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
  
  return { html };
}
