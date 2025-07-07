import { Body, Get, Post, Put, Query } from '@nestjs/common';
import { FeeService } from './fee.service';
import { Control } from "src/common/meta/control.meta";
import { Description } from 'src/common/meta/description.meta';
import { CreateShippingConfigDto } from './dto/create.dto';
import { UpdateShippingConfigDto } from './dto/update.dto';
import { GetFeeByCondition } from './dto/condition.dto';

@Control('fee')
export class FeeController {
    constructor(private readonly _feeService: FeeService, ){}

    @Post('createFree')
    @Description("Create a free fee", [{status: 200, description: 'Fee created successfully'}])
    async createFreeFee(@Body() createDto: CreateShippingConfigDto) {
        return await this._feeService.createDto(createDto);
    }

    @Put('updateFree')
    @Description("Update a free fee", [{status: 200, description: 'Fee updated successfully'}])
    async updateFreeFee(@Query('id') id: string, @Body() updateDto: UpdateShippingConfigDto) {
        return await this._feeService.updateDto(id, updateDto);
    }

    @Get('getFeeByCondition')
    @Description("Get fee by condition", [{status: 200, description: "Get successfully"}])
    async getFeeByCondition(@Query() condition: GetFeeByCondition){
        return await this._feeService.getFeeByCondition(condition);
    }

    @Get('getById')
    @Description("Get fee by id", [{status: 200, description: "Get successfully"}])
    async getById(@Query('id') id: string){
        return await this._feeService.getById(id);
    }
}

