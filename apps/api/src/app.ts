import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { BizError } from '#/errors/biz-error';
import { helperMiddleware } from '#/middlewares/helper';

const app = new Hono();

app.use(helperMiddleware);

app.onError((e, c) => {
  if (e instanceof BizError) return c.var.fail(e.message, e.code, null, 200);
  if (e instanceof HTTPException) return c.var.fail(e.message, e.status, null, e.status);
  return c.var.fail('Internal Server Error', 50000, null, 500);
});

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

export type AppType = typeof app;

export default app;
