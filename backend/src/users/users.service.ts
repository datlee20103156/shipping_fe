import { Injectable } from '@nestjs/common';
import { UsersRepo } from './users.repo';
import { CreateUserDto } from './dto/createUser.dto';
import { StringUtils } from 'src/common/utils/string.utils';
import { UserModel } from './model/user.model';
import { ResponseModel } from 'src/common/model/response.model';
import { MessageCode } from 'src/common/exception/MessageCode';
import { UserStatus } from './enum/status.enum';
import { PaginationDto } from 'src/common/paging/paging.dto';
import { GetUserCondition } from './dto/conditionUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FILE_UPLOAD_AVATAR_USER } from 'src/common/constants/media.constants';
import { MediaService } from 'src/media/media.service';
import { TypeImage } from 'src/media/enum/type.enum';
import mongoose, { startSession } from 'mongoose';
import { UpdateStatusDto } from 'src/common/dto/updateStatus';
import { InjectConnection } from '@nestjs/mongoose';
import { UserQuery } from 'src/auth/model/userQuery.model';
import { UserRole } from './enum/role.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly _usersRepo: UsersRepo,
    private readonly _mediaService: MediaService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async findOneByPhone(username: string) {
    const dataRes = await this._usersRepo.findByPhone(username);
    return dataRes;
  }

  async findByPhoneAuth(phone: string) {
    const dataRes = await this._usersRepo.findByPhoneOrCode(phone);
    return dataRes;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const data = {
        _id: StringUtils.generateObjectId(),
        fullname: createUserDto.fullname,
        phone: createUserDto.phone,
        password: createUserDto.password,
      };

      const dataRes = await this._usersRepo.createUser(data);

      return dataRes;
    } catch (error) {
      throw MessageCode.CUSTOM.dynamicError(error.code, error.message || error.errorResponse?.errmsg);
    }
  }

  async getUsersByCondition(condition: GetUserCondition) {
    return await this._usersRepo.getUsersByCondition(condition);
  }

  async findByPhone(phone: string): Promise<any> {
    return await this._usersRepo.findByPhone(phone);
  }

  async lockUser(uid, dataUpdate: UpdateStatusDto) {
    const user = await this._usersRepo.findById(uid);
    if (!user) {
      throw MessageCode.USER.NOT_FOUND;
    }

    const res = await this._usersRepo.updateUser(user._id, dataUpdate);
    return res;
  }

  async updateMyInfo(phone, updateUserDto, file) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = await this._usersRepo.findByPhone(phone, session);
      if (!user) throw MessageCode.USER.NOT_FOUND;

      if (file) {
        const imageLink = `${FILE_UPLOAD_AVATAR_USER}/${phone}.png`;
        updateUserDto.avatar = imageLink;
        await this._mediaService.uploadImage(
          file,
          TypeImage.AVATAR,
          phone,
          FILE_UPLOAD_AVATAR_USER,
          undefined,
          user._id,
          session,
        );
      }
      const userUpdate = await this._usersRepo.updateUser(user._id, updateUserDto, session);
      console.log(userUpdate);
      await session.commitTransaction();
      return userUpdate;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

async updateUser(user: UserQuery, update: UpdateUserDto) {
  const userRq = await this._usersRepo.findById(user.uid);

  const dataUpdate: any = {
    ...(update.fullname && { fullname: update.fullname })
  };

  if (userRq && userRq.role.includes(UserRole.USER)) {
    return await this._usersRepo.updateUser(user.uid, dataUpdate);
  } else {
    if(update.role){
      dataUpdate.role = [update.role];
    }
    return await this._usersRepo.updateByCondition({ phone: update.phone }, dataUpdate);
  }
}

}
