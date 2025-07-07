import { Get, Query } from '@nestjs/common';
import { OrderLogService } from './orderLog.service';
import { Control } from "src/common/meta/control.meta";
import { Description } from 'src/common/meta/description.meta';
import { GetByCondition } from './dto/condition.dto';

@Control('orderLog')
export class OrderLogController {
    constructor(private readonly _orderLogService: OrderLogService, ){}

    @Get('getById')
    @Description('Get by id', [{status: 200, description: 'get successfully'}])
    async getById(@Query('id') id: string){
        return await this._orderLogService.getById(id);
    }

    @Get('getByCondition')
    @Description('Get by condition', [{status: 200, description: 'get successfully'}])
    async getByCondition(@Query() condition: GetByCondition){
        return await this._orderLogService.getByCondition(condition)
    }
}

