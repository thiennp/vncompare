import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export async function render(url: string) {
  const html = renderToString(
    <React.StrictMode>
      <App url={url} />
    </React.StrictMode>
  );

  return { html };
}
