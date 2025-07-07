import { ApiBody } from '@nestjs/swagger';

export function ApiFile(fileName: string = 'file'): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
}
