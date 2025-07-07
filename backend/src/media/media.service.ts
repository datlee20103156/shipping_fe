import { UsersService } from 'src/users/users.service';
import { MediaRepo } from './media.repo';
import { Injectable } from '@nestjs/common';
import { MessageCode } from 'src/common/exception/MessageCode';
import { StringUtils } from 'src/common/utils/string.utils';
import { TypeImage } from './enum/type.enum';
import { HandelFile } from 'src/common/utils/handelFile.utils';
import { ClientSession } from 'mongoose';

@Injectable()
export class MediaService {
  constructor(private readonly _mediaRepo: MediaRepo) {}

  async addMultiImage(data: any) {
    const res = await this._mediaRepo.createMultiMedia(data);
    return res;
  }

  async uploadImage(file, type, filename, baseLink, uid?: string, relative_id?: string, session?: ClientSession) {
    if (!file) return null;

    const imageCompress = await HandelFile.compressFile(file);
    const link = `${baseLink}/${filename}.png`;

    const existing = await this._mediaRepo.findOneMediaByCondition({ link }, session);
    try {
      await HandelFile.handleFileImageUploadWhenExist(imageCompress, filename, baseLink);
    } catch (error) {
      HandelFile.deleteFile(link); // rollback ảnh
      throw new Error('File upload failed');
    }

    if (!existing) {
      const data = {
        _id: StringUtils.generateObjectId(),
        ...(uid && { uid: StringUtils.ObjectId(uid) }),
        ...(relative_id && { relative_id: StringUtils.ObjectId(relative_id) }),
        type,
        link,
      };
      return await this._mediaRepo.createMedia(data, session);
    }

    return existing;
  }

  async deleteImage(id: string, session?: ClientSession): Promise<any> {
    const listImage = await this._mediaRepo.findMediaById(id);
    const res = await this._mediaRepo.deleteMedia(id, session);
    if (res && listImage) {
      HandelFile.deleteFile(listImage.link);
      return res;
    }
  }

  async deleteMultiCondition(id_relative, session?: ClientSession) {
    const listImage = await this._mediaRepo.findMediaByCondition({ relative_id: id_relative }, session);
    const res = await this._mediaRepo.deleteMultiCondition(id_relative, session);
    if (res.deletedCount > 0) {
      listImage.forEach(item => {
        HandelFile.deleteFile(item.link);
      });
      return res;
    }
  }

  async uploadDocument(file, type, filename, baseLink, uid?: string, relative_id?: string, session?: ClientSession) {
    if (!file) return null;
  
    const fileExtension = file.originalname.split('.').pop();
    const link = `${baseLink}/${filename}.${fileExtension}`;
  
    const existing = await this._mediaRepo.findOneMediaByCondition({ link }, session);
    let dataRes: any = null;
    if (!existing) {
      try {
        await HandelFile.handleFileDocUploadWhenExist(file, filename, baseLink); // Không nén file document
        const data = {
          _id: StringUtils.generateObjectId(),
          ...(uid && { uid: StringUtils.ObjectId(uid) }),
          ...(relative_id && { relative_id: StringUtils.ObjectId(relative_id) }),
          type,
          link,
        };
        dataRes = await this._mediaRepo.createMedia(data, session);
      } catch (error) {
        HandelFile.deleteFile(link); // rollback file
        throw new Error('File document upload failed');
      }
    }
    return dataRes;
  }
}
