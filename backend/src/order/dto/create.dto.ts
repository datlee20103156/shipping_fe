import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "../enum/status.enum";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class ReceiverDto {
  @ApiProperty({ description: "Receiver name" })
  @IsString()
  name: string;

  @ApiProperty({ description: "Receiver phone number" })
  @IsString()
  phone: string;

  @ApiProperty({ description: "Receiver address" })
  @IsString()
  address: string;

  @ApiProperty({ description: "Receiver district" })
  @IsString()
  district: string;
}

class ItemDto {
  @ApiProperty({ description: "Item name", type: String })
  @IsString()
  name: string;

  @ApiProperty({ description: "Item weight in grams", type: Number })
  @IsNumber()
  weight: number;

  @ApiProperty({ description: "Is the item fragile?", type: Boolean })
  @IsBoolean()
  isFragile: boolean;
}

export class CreateOrderDto {
  @ApiProperty({
    description: "Receiver information",
    type: ReceiverDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => ReceiverDto)
  receiver: ReceiverDto;

  @ApiProperty({
    description: "sender information",
    type: ReceiverDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => ReceiverDto)
  sender: ReceiverDto;

  @ApiProperty({
    description: "Item information",
    type: [ItemDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  item: ItemDto[];

  @ApiProperty({
    description: "Shipping fee",
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  fee?: number;

  @ApiProperty({
    description: "Cash on delivery amount",
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  cod?: number;

  @ApiProperty({
    description: "Order status",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    description: "Shipper ID",
    type: String,
    required: false,
    default: null,
  })
  @IsOptional()
  @IsString()
  shipperId?: string | null;

  @ApiProperty({
    description: "Note",
    type: String,
    required: false,
    default: "",
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: "Time of receipt (optional)",
    type: String,
    format: "date-time",
    required: false,
    example: "2025-07-04T13:00:00.000Z",
  })
  @Type(() => Date)
  @IsDate()
  timeReceipt: Date;
}
