import mongoose from 'mongoose';

export type Topping = {
  _id?: mongoose.Types.ObjectId;
  name: string;
  image?: string; // Optional, if you are using file uploads
  price: number;
  tenantId: string;
  isPublish: boolean;
};
