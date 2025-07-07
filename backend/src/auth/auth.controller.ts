import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/meta/public.meta';
import { Control } from 'src/common/meta/control.meta';
import { SignInDto } from './dto/signin.dto';
import { Description } from 'src/common/meta/description.meta';
import { User } from 'src/common/meta/user.meta';
import { UserQuery } from './model/userQuery.model';

@Control('auth')
export class AuthController {
    private _authService: AuthService;
    constructor(authService: AuthService) {
        this._authService = authService;
    }

    @Public()
    @Post('login')
    @Description('Đăng Nhập' , [{status: 200, description: 'create successfully'}])
    async signIn(@Body() signInDto: SignInDto){
        return await this._authService.signIn(signInDto.phone, signInDto.password);
    }

    @Public()
    @Get('getUserByJWT')
    @Description('lây thông tin user từ token', [{status: 200, description: 'get successfully'}])
    async getUserByJWT(@User() user: UserQuery){
        return await this._authService.findByPhone(user.phone);
    }
}
