import { Injectable } from "@nestjs/common";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

@Schema({ _id: false })
class AdditionalFee {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

@Schema({
  timestamps: true,
})
export class Fee {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  _id: string;

  @Prop({ required: true })
  fromDistrict: string;

  @Prop({ required: true })
  toDistrict: string;

  @Prop({ required: true })
  baseFee: number;

  @Prop({ required: true })
  extraPerKg: number;

  @Prop({ type: [AdditionalFee], default: [] })
  additionalFees: AdditionalFee[];

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export type FeeDocument = Fee & Document;
export const FeeSchema = SchemaFactory.createForClass(Fee);
