import { ApiProperty } from "@nestjs/swagger";
import { PaginationDto } from "src/common/paging/paging.dto";
import { OrderStatus } from "../enum/status.enum";
import { IsDate, IsEnum, IsOptional } from "class-validator";
import { Transform, Type } from "class-transformer";

export class GetByCondition extends PaginationDto {
  @ApiProperty({
    description: "Order status",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({
    description: "Time of receipt (optional)",
    required: false,
    example: "2025-07-04T13:00:00.000Z",
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : null)
  timeReceipt: Date;
}
