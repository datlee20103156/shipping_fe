import { HttpStatus } from "@nestjs/common";
import { ApiException } from "./ApiException";

interface ApiExceptionOptions {
  code: string;
  message: string;
  status?: HttpStatus;
}

export function createApiException({
  code,
  message,
  status = HttpStatus.BAD_REQUEST,
}: ApiExceptionOptions): ApiException {
  return new ApiException({ code, message, status });
}

export const MessageCode = {
  USER: {
    NOT_FOUND: new ApiException({
      code: 'USER_NOT_FOUND',
      message: 'không tìm thấy user',
      status: HttpStatus.NO_CONTENT,
    }),
    INVALID_ROLE: new ApiException({
      code: 'INVALID_ROLE',
      message: 'bạn không có quyền',
      status: HttpStatus.FORBIDDEN,
    }),
    PHONE_IS_EXIST: new ApiException({
      code: 'PHONE_IS_EXIST',
      message: 'Số điện thoại đã được sử dụng',
      status: HttpStatus.CONFLICT,
    }),
    EMAIL_IS_EXIST: new ApiException({
      code: 'EMAIL_IS_EXIST',
      message: 'Email đã được sử dụng',
      status: HttpStatus.CONFLICT,
    })
  },

  AUTH: {
    PASSWORD_WRONG: new ApiException({
      code: 'PASSWORD_WRONG',
      message: 'Sai mật khẩu',
      status: HttpStatus.BAD_REQUEST,
    }),
    USER_NAME_WRONG: new ApiException({
      code: 'USER_NAME_WRONG',
      message: 'Sai tên đăng nhập',
      status: HttpStatus.BAD_REQUEST,
    })
  },
  
  ROLE: {
    ROLE_IS_EXIST: new ApiException({
      code: 'ROLE_IS_EXIST',
      message: 'Đã tồn tại Quyền',
      status: HttpStatus.CONFLICT,
    }),
    ROLE_IS_NOT_PERMISSION: new ApiException({
      code: 'ROLE_IS_NOT_PERMISSION',
      message: 'Người dùng không có Quyền',
      status: HttpStatus.FORBIDDEN,
    })
  },

  REQUEST: {
    BAD_REQUEST: new ApiException({
      code: 'BAD_REQUEST',
      message: 'Yêu cầu không hợp lệ',
      status: HttpStatus.BAD_REQUEST,
    })
  },

  TIME: {
    INVALID_TIME: new ApiException({
      code: 'INVALID_TIME',
      message: 'Sai thời gian',
      status: HttpStatus.BAD_REQUEST,
    }),
  },

  POINT: {
    POINTS_NOT_ENOUGH: new ApiException({
      code: 'POINTS_NOT_ENOUGH',
      message: 'Không đủ điểm',
      status: HttpStatus.BAD_REQUEST,
    })
  },

  ORDERS: {
    ORDER_PAID: new ApiException({
      code: 'ORDER_PAID',
      message: 'Đơn hàng đã được thanh toán',
      status: HttpStatus.BAD_REQUEST,
    }),
    ORDER_NOT_FOUND: new ApiException({
      code: 'ORDER_NOT_FOUND',
      message: 'Không tìm thấy order',
      status: HttpStatus.BAD_REQUEST,
    })
  },


  CUSTOM: {
    dynamicError: (code: string, msg: string) =>
      createApiException({
        code: code,
        message: msg,
        status: HttpStatus.BAD_REQUEST,
      }),
  },

  CATEGORY_SHOP: {
    NOT_FOUND: new ApiException({
      code: 'CATEGORY_SHOP_NOT_FOUND',
      message: 'Không tìm thấy danh mục cửa hàng',
      status: HttpStatus.NOT_FOUND,
    }),
  },

  CATEGORY_PRODUCT: {
    NOT_FOUND: new ApiException({
      code: 'CATEGORY_PRODUCT_NOT_FOUND',
      message: 'Không tìm thấy danh mục sản phẩm',
      status: HttpStatus.NOT_FOUND,
    }),
  },

  CATEGORY: {
    NOT_FOUND: new ApiException({
      code: 'CATEGORY_NOT_FOUND',
      message: 'Không tìm thấy danh mục',
      status: HttpStatus.NOT_FOUND,
    }),
  },

  SHOP: {
    NOT_OWNER: new ApiException({
      code: 'NOT_OWNER',
      message: 'Bạn không có quyền',
      status: HttpStatus.NOT_FOUND,
    }),
  },

  USER_REQUEST: {
    "response": {
      "statusCode": 403,
      "message": "Forbidden resource",
      "error": "Forbidden"
    },
  },
}