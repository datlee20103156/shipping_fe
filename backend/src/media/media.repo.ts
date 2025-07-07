import { Injectable } from '@nestjs/common';
import { Model, ClientSession } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Media, MediaDocument } from 'src/media/schema/media.schema';

@Injectable()
export class MediaRepo {
  private readonly _mediaModel: Model<MediaDocument>;

  constructor(@InjectModel(Media.name) mediaModel: Model<MediaDocument>) {
    this._mediaModel = mediaModel;
  }

  async createMedia(data: any, session?: ClientSession): Promise<MediaDocument> {
    const [media] = await this._mediaModel.create([data], { session });
    return media;
  }

  async createMultiMedia(data: any[], session?: ClientSession): Promise<MediaDocument[]> {
    return await this._mediaModel.insertMany(data, { session });
  }

  async findMediaById(id: any, session?: ClientSession): Promise<MediaDocument | null> {
    return await this._mediaModel.findById(id).session(session || null);
  }

  async findOneMediaByCondition(condition: any, session?: ClientSession): Promise<MediaDocument | null> {
    return await this._mediaModel.findOne(condition).session(session || null);
  }

  async findMediaByCondition(condition: any, session?: ClientSession): Promise<MediaDocument[]> {
    return await this._mediaModel.find(condition).session(session || null);
  }

  async updateMedia(id: any, data: any, session?: ClientSession): Promise<MediaDocument | null> {
    return await this._mediaModel.findByIdAndUpdate(id, data, { new: true, session });
  }

  async deleteMedia(id: any, session?: ClientSession): Promise<MediaDocument | null> {
    return await this._mediaModel.findByIdAndDelete(id, { session });
  }

  async deleteMultiCondition(relative_id: any, session?: ClientSession): Promise<any> {
    return await this._mediaModel.deleteMany({ relative_id }, { session });
  }
}
