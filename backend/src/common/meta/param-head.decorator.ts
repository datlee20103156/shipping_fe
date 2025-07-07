import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// data là tham số truyền vào decorator, dùng để chỉ định key trong header
export const ParamHeader = createParamDecorator(
  (data: string, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers[data]; // lấy giá trị header theo key được truyền vào
  },
);
