import { FeeModule } from './fee/fee.module';import { OrderLogModule } from "./orderLog/orderLog.module";
import { OrderModule } from "./order/order.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { MediaModule } from "./media/media.module";

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
FeeModule,    OrderLogModule,
    OrderModule,
    ConfigModule.forRoot({ envFilePath: !ENV ? ".env" : `.env.${ENV}` }),
    MongooseModule.forRoot(process.env.MONGOURL!, {
      dbName: process.env.DATABASE,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      serveRoot: "/public",
    }),
    AuthModule,
    UsersModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
