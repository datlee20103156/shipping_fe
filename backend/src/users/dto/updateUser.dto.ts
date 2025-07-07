import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, Length, IsArray } from "class-validator";
import { UserRole } from "../enum/role.enum";
import { UserStatus } from "../enum/status.enum";
import { CreateUserDto } from "./createUser.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}