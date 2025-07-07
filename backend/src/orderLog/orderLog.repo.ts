import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import {
  OrderLog,
  OrderLogDocument,
} from "src/orderLog/schema/orderLog.schema";
import { InjectModel } from "@nestjs/mongoose";
import { GetByCondition } from "./dto/condition.dto";
import { StringUtils } from "src/common/utils/string.utils";

@Injectable()
export class OrderLogRepo {
  private readonly _orderLogModel: Model<OrderLogDocument>;
  constructor(
    @InjectModel(OrderLog.name) orderLogModel: Model<OrderLogDocument>
  ) {
    this._orderLogModel = orderLogModel;
  }

  async createOrderLog(data: any): Promise<OrderLogDocument> {
    return await this._orderLogModel.create(data);
  }

  async createManyOrderLog(data: any): Promise<any> {
    return await this._orderLogModel.insertMany(data);
  }

  async findOrderLogById(id: any): Promise<any> {
    return await this._orderLogModel
      .findById(id)
      .populate("oid")
      .populate("actorId");
  }

  async findOneOrderLogByCondition(condition: any): Promise<any> {
    return await this._orderLogModel.findOne(condition);
  }

  async findOrderLogByCondition(condition: any): Promise<any> {
    return await this._orderLogModel.find(condition);
  }

  async updateOrderLog(id: any, data: any): Promise<any> {
    return await this._orderLogModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteOrderLog(id: any) {
    return await this._orderLogModel.findByIdAndDelete(id);
  }

  async getByCondition(condition: GetByCondition) {
    const query: any = {};
    if (condition.type) query.type = condition.type;

    const limit = condition.limit || 10;
    const skip = (condition.page - 1) * limit || 0;

    const sort: any = {};
    if (condition.orderBy) {
      const [field, order] = condition.orderBy.split(":");
      sort[field] = order === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    if (condition.query) {
      query.$or = [
        { oid: StringUtils.ObjectId(condition.query) },
        { actorId: StringUtils.ObjectId(condition.query) },
      ];
    }

    if (condition.time_from && condition.time_to) {
      query["createdAt"] = {
        $gte: new Date(condition.time_from),
        $lte: new Date(condition.time_to),
      };
    }

    const total = await this._orderLogModel.countDocuments(query);

    const orderLog = await this._orderLogModel
      .find(query)
      .populate("oid")
      .populate("actorId")
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();

    return {
      orderLog,
      total,
      page: condition.page,
      limit,
    };
  }
}
