import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Web</h1>
      <p className="mt-4 text-lg">TanStack Start app initialized with the shared scaffold stack.</p>
    </div>
  );
}
