import { zValidator } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type * as v3 from 'zod/v3';
import type * as v4 from 'zod/v4/core';
import { BizError } from '#/errors/biz-error';

type ZodSchema = v3.ZodType | v4.$ZodType;

export function zv<T extends keyof ValidationTargets, S extends ZodSchema>(target: T, schema: S) {
  return zValidator(target, schema, (result) => {
    if (!result.success) {
      throw new BizError(40100, `参数错误：${result.error.message}`);
    }
  });
}
