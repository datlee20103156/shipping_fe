import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessageCode } from 'src/common/exception/MessageCode';
import { ResponseModel } from 'src/common/model/response.model';
import { UserModel } from 'src/users/model/user.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private _userService: UsersService;
  private _jwtService: JwtService;
  constructor(userService: UsersService, jwtService: JwtService) {
    this._userService = userService;
    this._jwtService = jwtService;
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this._userService.findByPhoneAuth(username);
    if (!user) throw MessageCode.AUTH.USER_NAME_WRONG;
    if (user?.password !== pass) throw MessageCode.AUTH.PASSWORD_WRONG;
    const payload = { uid: user._id, username: user.phone };
    const token = await this._jwtService.signAsync(payload);
    const userObj = user.toObject();
    delete userObj.password;
    return {
      token,
      user: userObj,
    };
  }

  async findByPhone(username): Promise<any> {
    const infoUser = await this._userService.findOneByPhone(username);
    if (!infoUser) {
      throw MessageCode.USER.NOT_FOUND;
    }
    return infoUser;
  }
}
