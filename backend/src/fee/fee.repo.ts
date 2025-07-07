import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Fee, FeeDocument } from "src/fee/schema/fee.schema";
import { InjectModel } from "@nestjs/mongoose";
import { GetFeeByCondition } from "./dto/condition.dto";

@Injectable()
export class FeeRepo {
  private readonly _feeModel: Model<FeeDocument>;
  constructor(@InjectModel(Fee.name) feeModel: Model<FeeDocument>) {
    this._feeModel = feeModel;
  }

  async createFee(data: any): Promise<FeeDocument> {
    return await this._feeModel.create(data);
  }

  async createManyFee(data: any): Promise<any> {
    return await this._feeModel.insertMany(data);
  }

  async findFeeById(id: any): Promise<any> {
    return await this._feeModel.findById(id);
  }

  async findOneFeeByCondition(condition: any): Promise<any> {
    return await this._feeModel.findOne(condition);
  }

  async findFeeByCondition(condition: any): Promise<any> {
    return await this._feeModel.find(condition);
  }

  async updateFee(id: any, data: any): Promise<any> {
    return await this._feeModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteFee(id: any) {
    return await this._feeModel.findByIdAndDelete(id);
  }

  async getDistrictFees(
    fromDistrict: string,
    toDistrict: string
  ): Promise<FeeDocument[]> {
    return this._feeModel.find({
      isActive: true,
      $or: [
        { fromDistrict, toDistrict },
        { fromDistrict: toDistrict, toDistrict: fromDistrict },
      ],
    });
  }

  async getFeeByCondition(condition: GetFeeByCondition) {
    const query: any = {};

    if (condition.isActive) query.isActive = condition.isActive;

    if (condition.query) {
      const regex = new RegExp(condition.query, "i");
      query.$or = [
        { fromDistrict: { $regex: regex } },
        { toDistrict: { $regex: regex } },
      ];
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

    const total = await this._feeModel.countDocuments(query);

    const fees = await this._feeModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort);

    return {
      fees,
      total,
      page: condition.page,
      limit,
    };
  }
}
