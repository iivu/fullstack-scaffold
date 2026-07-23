import { HTTPException } from 'hono/http-exception';

export class BizError extends HTTPException {
  constructor(
    public readonly code: number,
    public readonly message: string,
  ) {
    super(400, { message });
  }
}
