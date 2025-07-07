import {OrderRepo } from './order.repo';import { Order, OrderSchema } from './schema/order.schema';import { OrderService } from './order.service';import { OrderController } from './order.controller';
import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { FeeModule } from 'src/fee/fee.module';
import { OrderLogModule } from 'src/orderLog/orderLog.module';

@Module({
    imports: [UsersModule, 
        FeeModule,
        OrderLogModule,
        MongooseModule.forFeature([{name: Order.name, schema: OrderSchema}])],
    controllers: [OrderController],
    providers: [OrderService, OrderRepo],
    exports: [OrderService, OrderRepo]
})
export class OrderModule {}

