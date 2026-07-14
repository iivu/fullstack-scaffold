import { lazy } from 'react';

export const TiptapEditor = lazy(() => import('./editor').then((module) => ({ default: module.TiptapEditor })));
