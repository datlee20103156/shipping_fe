import { Injectable } from "@nestjs/common";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { OrderStatus } from "../enum/status.enum";

@Schema({
  timestamps: true,
})
export class Order {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  _id: string;

  @Prop({ required: true })
  code: string; // VD: "DH00001"

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  senderId: string;

  @Prop({
    type: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      district: { type: String, required: true },
    },
    required: true,
  })
  receiver: {
    name: string;
    phone: string;
    address: string;
    district: string;
  };

  @Prop({
    type: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      district: { type: String, required: true },
    },
    required: true,
  })
  sender: {
    name: string;
    phone: string;
    address: string;
    district: string;
  };

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        weight: { type: Number, required: true }, // gram
        isFragile: { type: Boolean, required: true },
      },
    ],
    required: true,
  })
  items: {
    name: string;
    weight: number;
    isFragile: boolean;
  }[];

  @Prop({ required: true })
  fee: number;

  @Prop({ type: [{ name: String, price: Number }], default: [] })
  appliedFees: { name: string; price: number }[];

  @Prop({ required: true })
  cod: number;

  @Prop({
    required: true,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null })
  shipperId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null })
  dispatcherId: string;

  @Prop({ default: "" })
  note: string;

  @Prop({ type: Date, required: true })
  timeReceipt: Date;

}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
