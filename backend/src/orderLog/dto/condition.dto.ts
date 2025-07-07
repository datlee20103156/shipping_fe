import { ApiProperty } from "@nestjs/swagger";
import { PaginationDto } from "src/common/paging/paging.dto";
import { TypeLog } from "../enum/type.enum";
import { IsEnum, IsOptional } from "class-validator";


export class GetByCondition extends PaginationDto{
    @ApiProperty({
        description: 'Type',
        enum: TypeLog,
        default: TypeLog.ORDER,
        required: false
    })
    @IsOptional()
    @IsEnum(TypeLog)
    type: TypeLog;
}