import { StringUtils } from "src/common/utils/string.utils";
import { CreateOrderDto } from "./dto/create.dto";
import { OrderRepo } from "./order.repo";
import { Injectable } from "@nestjs/common";
import { RandomCodeUtils } from "src/common/utils/randomCode.utils";
import { UpdateOrderDto } from "./dto/update.dto";
import { Types } from "mongoose";
import { UserQuery } from "src/auth/model/userQuery.model";
import { OrderStatus } from "./enum/status.enum";
import { FeeService } from "src/fee/fee.service";
import { MessageCode } from "src/common/exception/MessageCode";
import { OrderLogModule } from "src/orderLog/orderLog.module";
import { CreateLog } from "src/orderLog/dto/create.dto";
import { OrderLogService } from "src/orderLog/orderLog.service";
import { TypeLog } from "src/orderLog/enum/type.enum";
import { GetByCondition } from "./dto/condition.dto";
import { UsersService } from "src/users/users.service";
import { UserRole } from "src/users/enum/role.enum";

@Injectable()
export class OrderService {
  constructor(
    private readonly _orderRepo: OrderRepo,
    private readonly _feeService: FeeService,
    private readonly _logService: OrderLogService,
    private readonly _userService: UsersService
  ) {}

  async createOrder(user: UserQuery, createDto: CreateOrderDto) {
    const fee = await this._feeService.getDistrictFees(
      createDto.sender.district,
      createDto.receiver.district
    );

    if (fee.length == 0) {
      throw MessageCode.CUSTOM.dynamicError(
        "ADDRESS_NOT_FOUND",
        `No shipping fee found for districts: ${createDto.sender.district} to ${createDto.receiver.district}`
      );
    }

    const totalWeight = createDto.item
      .map((item) => item.weight)
      .reduce((a, b) => a + b, 0);
    const pricePerKg = fee[0].extraPerKg * totalWeight;
    const baseFee = fee[0].baseFee;

    const totalPrice = pricePerKg + baseFee;

    const appliedFees: { name: string; price: number }[] = [];

    appliedFees.push({
      name: "fee weight",
      price: pricePerKg,
    });

    appliedFees.push({
      name: "fee base",
      price: fee[0].baseFee,
    });

    const oid = StringUtils.generateObjectId();
    const code = RandomCodeUtils.generateUniqueCode(5);

    const data = {
      _id: oid,
      code: code,
      senderId: user.uid,
      receiver: createDto.receiver,
      sender: createDto.sender,
      items: createDto.item,
      fee: totalPrice,
      appliedFees: appliedFees,
      cod: totalPrice,
      status: OrderStatus.PENDING,
      note: createDto?.note || "",
      timeReceipt: createDto.timeReceipt,
    };

    await this._logService.createLog({
      oid: oid,
      type: TypeLog.ORDER,
      actorId: user.uid,
      note: `createe order: ${code}`,
    });

    return await this._orderRepo.createOrder(data);
  }

  async updateOrder(
    id: string,
    updateDto: Partial<UpdateOrderDto>,
    user: UserQuery
  ) {
    const order = await this._orderRepo.findOrderById(id);

    const userUpdate = await this._userService.findByPhone(user.phone);

    const updateData: any = { ...updateDto };
    if (userUpdate.role.includes(UserRole.OPERATOR)) {
      updateData.dispatcherId = user.uid;
    }

    await this._logService.createLog({
      oid: order._id,
      type: TypeLog.ORDER,
      actorId: user.uid,
      note: `update order: ${order.code} \n ${JSON.stringify(updateDto, null, 2)}`,
    });
    return await this._orderRepo.updateOrder(id, updateData);
  }

  async getByCondiditon(user: UserQuery, condition: GetByCondition) {
    const userQe = await this._userService.findByPhone(user.phone);

    if (userQe.role.includes(UserRole.USER)) {
      return await this._orderRepo.getOrderByPagin(
        condition,
        user.uid,
        UserRole.USER
      );
    } else if (userQe.role.includes(UserRole.SHIPER)) {
      return await this._orderRepo.getOrderByPagin(
        condition,
        user.uid,
        UserRole.SHIPER
      );
    } else {
      return await this._orderRepo.getOrderByPagin(condition);
    }
  }

  async getById(id: string) {
    return await this._orderRepo.findOrderById(id);
  }
}
