import mongoose, { AggregatePaginateModel } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { Product } from './product-types';

const attributeValueSchema = new mongoose.Schema({
  name: { type: String },
  value: { type: mongoose.Schema.Types.Mixed },
});

const priceConfigurationSchema = new mongoose.Schema({
  priceType: { type: String, enum: ['base', 'aditional'], required: true },
  availableOptions: {
    type: Map,
    of: Number,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: false },
    priceConfiguration: {
      type: Map,
      of: priceConfigurationSchema,
    },
    attributes: [attributeValueSchema],
    tenantId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    isPublished: { type: Boolean, default: false, required: false },
  },
  { timestamps: true },
);
productSchema.plugin(aggregatePaginate);

// export default mongoose.model('Product', productSchema);
export default mongoose.model<Product, AggregatePaginateModel<Product>>('Product', productSchema);
