import { Injectable } from "@nestjs/common";
import { Model, ObjectId, ClientSession } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { User, UserDocument } from "./schema/users.schema";
import { UserModel } from "./model/user.model";
import { GetUserCondition } from "./dto/conditionUser.dto";

@Injectable()
export class UsersRepo {
  private readonly _userModel: Model<UserDocument>;

  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    this._userModel = userModel;
  }

  async createUser(
    data: Partial<UserModel>,
    session?: ClientSession
  ): Promise<UserDocument> {
    const [user] = await this._userModel.create([data], { session });
    return user;
  }

  async getUsersByCondition(
    condition: GetUserCondition,
    session?: ClientSession
  ) {
    const query: any = {};
    if (condition.query) {
      const regex = new RegExp(condition.query, "i");
      query.$or = [
        { fullname: { $regex: regex } },
        { phone: { $regex: regex } },
        { code: { $regex: regex } },
      ];
    }

    if (condition.time_from && condition.time_to) {
      query["createdAt"] = {
        $gte: new Date(condition.time_from),
        $lte: new Date(condition.time_to),
      };
    }

    const limit = condition.limit || 10;
    const skip = (condition.page - 1) * limit || 0;

    const sort: any = {};
    if (condition.orderBy) {
      const [field, order] = condition.orderBy.split(":");
      sort[field] = order === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    if (condition.role) {
      query.role = {
        $in: Array.isArray(condition.role) ? condition.role : [condition.role],
      };
    }

    if (condition.status) {
      query.status = condition.status;
    }

    const total = await this._userModel.countDocuments(query);

    const data = await this._userModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();

    return {
      data,
      total,
      condition: condition.page,
      limit,
    };
  }

  async deleteUser(idUser: ObjectId, session?: ClientSession) {
    return await this._userModel.findByIdAndDelete(idUser, { session });
  }

  async findByPhone(
    phone: string,
    session?: ClientSession
  ): Promise<UserDocument | null> {
    return await this._userModel.findOne({ phone }).session(session || null);
  }

  async findByPhoneOrCode(
    identifier: string,
    session?: ClientSession
  ): Promise<UserDocument | null> {
    return this._userModel
      .findOne({
        $or: [{ phone: identifier }, { code: identifier }],
      })
      .select("+password")
      .session(session || null);
  }

  async findById(
    uid: any,
    session?: ClientSession
  ): Promise<UserDocument | null> {
    return await this._userModel.findById(uid).session(session || null);
  }

  async updateUser(uid, data, session?: ClientSession) {
    return await this._userModel.findByIdAndUpdate(uid, data, {
      new: true,
      session,
    });
  }

  async updateByCondition(conditon, data){
    return await this._userModel.findOneAndUpdate(conditon, data, {new : true})
  }
}
