import crypto from 'node:crypto';

import type { ApiResponse } from '@r/contracts';
import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

import { BizError } from '#/errors/biz-error';

function buildMeta() {
  return {
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
}

function ok<T>(c: Context, data: T) {
  return c.json<ApiResponse<T>>({ code: 0, message: 'ok', data, meta: buildMeta() }, 200);
}

function fail<T>(c: Context, message: string, code: number, data?: T, status: ContentfulStatusCode = 200) {
  const payload: ApiResponse<T> = { code, message, meta: buildMeta() };
  if (data) payload.data = data;
  return c.json(payload, status);
}

function bizError(message: string, code: number = 40000): never {
  throw new BizError(code, message);
}

export const helperMiddleware = createMiddleware(async (c, next) => {
  c.set('ok', <T>(data: T) => ok(c, data));
  c.set('fail', <T>(message: string, code: number, data?: T, status: ContentfulStatusCode = 200) => fail(c, message, code, data, status));
  c.set('bizError', (message: string, code: number) => bizError(message, code));
  c.set('invalidParams', (message: string = '参数错误') => bizError(message, 40000));
  await next();
});

declare module 'hono' {
  export interface ContextVariableMap {
    ok: <T>(data: T) => ReturnType<typeof ok<T>>;
    fail: <T>(message: string, code: number, data?: T, status?: ContentfulStatusCode) => ReturnType<typeof fail<T>>;
    bizError: (message: string, code: number) => ReturnType<typeof bizError>;
    invalidParams: (message?: string) => ReturnType<typeof bizError>;
  }
}
