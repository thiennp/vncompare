import type { Config } from '@react-router/dev/config';

export default {
  // Server-side rendering configuration
  ssr: true,
  // Future flags for React Router v7
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
} satisfies Config;
