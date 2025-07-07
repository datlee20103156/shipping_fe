import {FeeRepo } from './fee.repo';import { Fee, FeeSchema } from './schema/fee.schema';import { FeeService } from './fee.service';import { FeeController } from './fee.controller';
import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [UsersModule, MongooseModule.forFeature([{name: Fee.name, schema: FeeSchema}])],
    controllers: [FeeController],
    providers: [FeeService, FeeRepo],
    exports: [FeeService, FeeRepo]
})
export class FeeModule {}

