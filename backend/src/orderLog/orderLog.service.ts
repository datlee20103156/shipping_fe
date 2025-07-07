import { StringUtils } from 'src/common/utils/string.utils';
import { CreateLog } from './dto/create.dto';
import { OrderLogRepo } from './orderLog.repo';
import { Injectable } from "@nestjs/common";
import { GetByCondition } from './dto/condition.dto';

@Injectable()
export class OrderLogService {
    constructor(private readonly _orderLogRepo: OrderLogRepo, ) {}

    async createLog(createLog: CreateLog){
        const data = {
            _id: StringUtils.generateObjectId(),
            oid: StringUtils.ObjectId(createLog.oid),
            type: createLog.type,
            actorId: createLog.actorId,
            note: createLog.note
        }

        return await this._orderLogRepo.createOrderLog(data);
    }

    async getById(id){
        return await this._orderLogRepo.findOrderLogById(id);
    }

    async getByCondition(condition: GetByCondition){
        return await this._orderLogRepo.getByCondition(condition);
    }
}

