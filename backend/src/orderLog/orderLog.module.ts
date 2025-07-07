import {OrderLogRepo } from './orderLog.repo';import { OrderLog, OrderLogSchema } from './schema/orderLog.schema';import { OrderLogService } from './orderLog.service';import { OrderLogController } from './orderLog.controller';
import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [UsersModule, MongooseModule.forFeature([{name: OrderLog.name, schema: OrderLogSchema}])],
    controllers: [OrderLogController],
    providers: [OrderLogService, OrderLogRepo],
    exports: [OrderLogService, OrderLogRepo]
})
export class OrderLogModule {}

