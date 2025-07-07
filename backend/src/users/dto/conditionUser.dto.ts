import { ApiProperty } from "@nestjs/swagger";
import { PaginationDto } from "src/common/paging/paging.dto";
import { UserRole } from "../enum/role.enum";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { UserStatus } from "../enum/status.enum";


export class GetUserCondition extends PaginationDto{

    @ApiProperty({
        description: 'Role',
        type: String,
        enum: UserRole,
        required: false,
    })
    @IsOptional()
    @IsEnum(UserRole, {message: 'ohh UserRole'})
    @IsString()
    role: string;

    @ApiProperty({
        description: 'Trạng thái',
        type: String,
        enum: UserStatus,
        required: false,
    })
    @IsOptional()
    @IsEnum(UserStatus, {message: 'ohh UserStatus'})
    @IsString()
    status: string;
}