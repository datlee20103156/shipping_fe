import { Injectable } from "@nestjs/common";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

@Schema({
  timestamps: true,
})
export class OrderLog {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Order" })
  oid: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  actorId: string;

  @Prop({ required: true })
  note: string;
}

export type OrderLogDocument = OrderLog & Document;
export const OrderLogSchema = SchemaFactory.createForClass(OrderLog);
