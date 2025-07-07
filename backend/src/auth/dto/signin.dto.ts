import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class SignInDto{
    @ApiProperty({ 
        description: 'phone or mssv',
        type : String,
    })
    @IsString()
    phone: string;

    @ApiProperty({ 
        description: 'password',
        type: String,
    })
    @IsString()
    password : string;
}