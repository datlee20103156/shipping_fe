import { Body, Get, Post, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Control } from "src/common/meta/control.meta";
import { Description } from 'src/common/meta/description.meta';
import { CreateOrderDto } from './dto/create.dto';
import { UpdateOrderDto } from './dto/update.dto';
import { User } from 'src/common/meta/user.meta';
import { UserQuery } from 'src/auth/model/userQuery.model';
import { Roles } from 'src/common/meta/role.meta';
import { UserRole } from 'src/users/enum/role.enum';
import { GetByCondition } from './dto/condition.dto';

@Control('order')
export class OrderController {
    constructor(private readonly _orderService: OrderService, ){}

    @Post('create')
    @Roles(UserRole.ADMIN, UserRole.USER, UserRole.OPERATOR)
    @Description("create new order", [{status: 200, description: 'create successfully'}])
    async createOrder(@User() user : UserQuery, @Body() createDto: CreateOrderDto) {
        return await this._orderService.createOrder(user, createDto);
    }

    @Put('update')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR, UserRole.SHIPER)
    @Description("update order", [{status: 200, description: 'update successfully'}])
    async updateOrder(@Query("id") id: string, @Body() updateDto: UpdateOrderDto, @User() user : UserQuery,) {
        return await this._orderService.updateOrder(id, updateDto, user);
    }  

    @Get('getByCondition')
    @Description('get by condition', [{status: 200, description: 'Get order by condition'}])
    async getByCondiditon(@User() user : UserQuery, @Query() condition: GetByCondition){
        return await this._orderService.getByCondiditon(user, condition)
    }

    @Get('getById')
    @Description('get order by ID', [{status: 200, description: 'Get order by ID'}])
    async getById(@Query('id') id: string){
        return await this._orderService.getById(id);
    }

}

