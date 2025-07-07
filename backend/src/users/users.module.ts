import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepo } from './users.repo';
import { MediaModule } from 'src/media/media.module';

@Module({
    imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), MediaModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepo],
    exports: [UsersService, UsersRepo]
})
export class UsersModule {}
