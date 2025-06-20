import categoryModel from './product-model';
import { Product } from './product-types';

export class ProductService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(category: Product) {
    const newCategory = new categoryModel(category);
    return newCategory.save();
  }

  // async getAll(): Promise<Product[]> {
  //   const categories = await categoryModel.find().lean();
  //   return categories || [];
  // }

  async getById(id: string) {
    return categoryModel.findById(id).lean();
  }

  async update(id: string, category: Product) {
    return categoryModel
      .findByIdAndUpdate(id, category, {
        new: true,
        runValidators: true,
      })
      .lean();
  }

  async delete(id: string) {
    return categoryModel.findByIdAndDelete(id).lean();
  }
}
