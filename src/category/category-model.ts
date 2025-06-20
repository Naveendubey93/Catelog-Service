import mongoose from 'mongoose';
import { Attribute, Category, PriceConfiguration } from './category-types';

const priceConfigurationSchema = new mongoose.Schema<PriceConfiguration>({
  priceType: { type: String, enum: ['base', 'aditional'], required: true },
  availableOptions: { type: [String], required: true },
});

const attributeSchema = new mongoose.Schema<Attribute>({
  name: { type: String, required: true },
  widgetType: { type: String, enum: ['switch', 'dropdown', 'text'], required: true },
  defaultValue: { type: mongoose.Schema.Types.Mixed, required: true },
  availableOptions: { type: [String], required: false },
});

const categorySchema = new mongoose.Schema<Category>(
  {
    name: { type: String, required: true },
    priceConfiguration: {
      type: Map,
      of: priceConfigurationSchema,
      required: true,
    },
    attributes: [
      {
        type: [attributeSchema],
        required: true,
      },
    ],
  },
  { timestamps: true },
);
export default mongoose.model<Category>('Category', categorySchema);
// export const CategoryModel = mongoose.model<Category>('Category', categorySchema);

/*
{
  "name": "Pizza",
  "priceConfiguration": {
    "Size": {
      "priceType": "base",
      "availableOptions": [
        "Small",
        "Medium",
        "Large"
      ]
    },
    "Crust": {
      "priceType": "base",
      "availableOptions": [
        "Thin",
        "Thick",
        "Stuffed"
      ]
    },
    "attributes": [
      {
        "name": "isHit",
         "widgetType": "switch",
         "defaultValue": "No",
        "availableOptions": [
          "Yes",
          "No"
        ]
      },
    }
    */
