import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import app from '#/app';
import { appEnv } from '#/env';

const honoServer = serve(
  {
    fetch: app.fetch,
    port: appEnv.PORT ?? 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

function gracefulShutdown() {
  honoServer.close((err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }
    console.log('Server has been shut down gracefully.');
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  gracefulShutdown();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  gracefulShutdown();
});
