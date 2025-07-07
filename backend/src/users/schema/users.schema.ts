import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserRole } from '../enum/role.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  _id: string;

  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, type: [String], enum: UserRole, default: [UserRole.USER] })
  role: UserRole[];

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
 