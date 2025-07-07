import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class AdditionalFeeDto {
  @ApiProperty({ description: 'Fee key (e.g., "night_fee", "fragile")' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Fee display name (e.g., "Phí giao ban đêm")' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Fee price (VNĐ)' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Is the fee active?', default: false })
  @IsBoolean()
  isActive: boolean;
}

export class CreateShippingConfigDto {
  @ApiProperty({ description: 'From district', type: String })
  @IsString()
  fromDistrict: string;

  @ApiProperty({ description: 'To district', type: String })
  @IsString()
  toDistrict: string;

  @ApiProperty({ description: 'Base shipping fee (VNĐ)', type: Number })
  @IsNumber()
  baseFee: number;

  @ApiProperty({ description: 'Extra fee per kg beyond weight threshold', type: Number })
  @IsNumber()
  extraPerKg: number;

  @ApiProperty({
    description: 'List of additional fees (optional)',
    type: [AdditionalFeeDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalFeeDto)
  additionalFees?: AdditionalFeeDto[];

  @ApiProperty({ description: 'Is config active?', default: true })
  @IsBoolean()
  isActive?: boolean = true;
}