import mongoose, { AggregatePaginateModel } from 'mongoose';
import paginate from 'mongoose-aggregate-paginate-v2';
import { Topping } from './topping-types';
const toppingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: false },
    price: { type: Number, required: true },
    tenantId: { type: String, required: true },
    isPublish: { type: Boolean, default: false, required: false },
  },
  { timestamps: true },
);
toppingSchema.plugin(paginate);
export default mongoose.model<Topping, AggregatePaginateModel<Topping>>('Topping', toppingSchema);
