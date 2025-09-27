import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterProvider } from 'react-router-dom';
import { createSSRRouter } from './routes';

export async function render(url: string) {
  const router = createSSRRouter(url);
  
  const html = renderToString(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );

  return { html };
}
