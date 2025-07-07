import { ApiProperty } from "@nestjs/swagger";
import { TypeLog } from "../enum/type.enum";
import { IsEnum } from "class-validator";


export class CreateLog {
    @ApiProperty({
        description: 'Order ID',
        type: String,
        required: true
    })
    oid: string;

    @ApiProperty(
        {
            description: 'Type',
            enum: TypeLog,
            default: TypeLog.ORDER
        }
    )
    @IsEnum(TypeLog)
    type: string

    @ApiProperty({
        description: 'actor ID',
        type: String,
        required: true
    })
    actorId?: string;

    @ApiProperty({
        description: 'note',
        type: String,
        required: false
    })
    note?: string
}