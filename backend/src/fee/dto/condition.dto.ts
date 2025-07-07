import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean } from "class-validator";
import { PaginationDto } from "src/common/paging/paging.dto";


export class GetFeeByCondition extends PaginationDto{
    @ApiProperty({
        description: 'Is Active',
        type: Boolean,
        default: true,
        required: false
    })
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isActive: boolean
}