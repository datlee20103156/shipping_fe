import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Status } from "../enum/status.enum";

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Trạng thái',
    enum: Status,
    required: true,
  })
  @IsEnum(Status)
  status: Status;
}
