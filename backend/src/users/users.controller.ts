import { Body, Controller, Delete, Get, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Control } from 'src/common/meta/control.meta';
import { CreateUserDto } from './dto/createUser.dto';
import { Public } from 'src/common/meta/public.meta';
import { Description } from 'src/common/meta/description.meta';
import { Roles } from 'src/common/meta/role.meta';
import { UserRole } from './enum/role.enum';
import { UserStatus } from './enum/status.enum';
import { User } from 'src/common/meta/user.meta';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PaginationDto } from 'src/common/paging/paging.dto';
import { UploadMedia } from 'src/common/meta/upload-media.meta';
import { GetUserCondition } from './dto/conditionUser.dto';
import { UpdateStatusDto } from 'src/common/dto/updateStatus';
import { UserQuery } from 'src/auth/model/userQuery.model';



@Control('users')
export class UsersController {
    constructor(private readonly _userService: UsersService) {}

    @Post('createUser')
    @Description('Tạo một user mới' , [{status: 200, description: 'create successfully'}])
    async createUser(@Body() createUserDto: CreateUserDto){
        return await this._userService.createUser(createUserDto);
    }

    @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SHIPER, UserRole.USER)
    @Get('getUserByQuery')
    @Description('Lấy thông tin user', [{status: 200, description: 'create successfully'}])
    async getUsers(@Query() condition: GetUserCondition){
        return await this._userService.getUsersByCondition(condition);
    }


    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @Delete('lockUser')
    @Description('Khóa người dùng [INACTIVE], [ACTIVE]' , [{status: 200, description: 'lock successfully'}])
    async lockUser(@Query('uid') uid: string, @Body() data: UpdateStatusDto){
        return await this._userService.lockUser(uid, data);
    }

    @Public()
    @Get('getUserByPhone')
    @Description('Lấy thông tin user theo sđt' , [{status: 200, description: 'get successfully'}])
    async getUserByPhone(@Query('phone') phone: string){
        return await this._userService.findByPhone(phone);
    }

    @Public()
    @Put('updateMyInfo') 
    @UploadMedia('file', false)
    @Description('Thêm addAvatar vào user', [{status: 200, description: 'add successfully'}])
    async updateMyInfo(@User() user: UserQuery, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file){
        return await this._userService.updateMyInfo(user.phone, updateUserDto, file); 
    }

    @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.USER)
    @Put('updateRoleUser')
    @Description('update user', [{status: 200, description: 'update successfully'}])
    async updateUser(@User() user: UserQuery, @Body() update: UpdateUserDto){
        return await this._userService.updateUser(user, update);
    }
}