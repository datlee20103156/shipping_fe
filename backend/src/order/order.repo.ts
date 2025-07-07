import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Order, OrderDocument } from "src/order/schema/order.schema";
import { InjectModel } from "@nestjs/mongoose";
import { GetByCondition } from "./dto/condition.dto";
import { UserRole } from "src/users/enum/role.enum";
import { StringUtils } from "src/common/utils/string.utils";

@Injectable()
export class OrderRepo {
  private readonly _orderModel: Model<OrderDocument>;
  constructor(@InjectModel(Order.name) orderModel: Model<OrderDocument>) {
    this._orderModel = orderModel;
  }

  async createOrder(data: any): Promise<OrderDocument> {
    return await this._orderModel.create(data);
  }

  async createManyOrder(data: any): Promise<any> {
    return await this._orderModel.insertMany(data);
  }

  async findOrderById(id: any): Promise<any> {
    return await this._orderModel
      .findById(id)
      .populate("senderId")
      .populate("shipperId")
      .populate("dispatcherId");
  }

  async findOneOrderByCondition(condition: any): Promise<any> {
    return await this._orderModel.findOne(condition);
  }

  async findOrderByCondition(condition: any): Promise<any> {
    return await this._orderModel.find(condition);
  }

  async updateOrder(id: any, data: any): Promise<any> {
    return await this._orderModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteOrder(id: any) {
    return await this._orderModel.findByIdAndDelete(id);
  }

  async getOrderByPagin(
    condition: GetByCondition,
    uid?: string,
    role?: UserRole
  ) {
    const query: any = {};

    if (condition.status) query.status = condition.status;

    if (condition.query) {
      const regex = new RegExp(condition.query, "i");
      query.$or = [{ code: { $regex: regex } }];
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

    if (uid) {
      const id = StringUtils.ObjectId(uid);

      if (role === UserRole.SHIPER) {
        query.shipperId = id;
      } else if (role === UserRole.USER) {
        query.senderId = id;
      }
    }

    if (condition.timeReceipt) {
      query["timeReceipt"] = {
        $gte: new Date(condition.timeReceipt),
        $lte: new Date(condition.timeReceipt),
      };
    } else if (condition.time_from && condition.time_to) {
      query["createdAt"] = {
        $gte: new Date(condition.time_from),
        $lte: new Date(condition.time_to),
      };
    }

    const total = await this._orderModel.countDocuments(query);

    const orders = await this._orderModel
      .find(query)
      .populate("senderId")
      .populate("shipperId")
      .populate("dispatcherId")
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();

    return {
      orders,
      total,
      page: condition.page,
      limit,
    };
  }
}
