import productModel from './product-model';
import { Product } from './product-types';

export class ProductService {
  async createProduct(product: Product) {
    return productModel.create(product);
  }

  // async getAll(): Promise<Product[]> {
  //   const categories = await categoryModel.find().lean();
  //   return categories || [];
  // }

  async getById(id: string) {
    return productModel.findById(id).lean();
  }

  async update(id: string, category: Product) {
    return productModel
      .findByIdAndUpdate(id, category, {
        new: true,
        runValidators: true,
      })
      .lean();
  }

  async delete(id: string) {
    return productModel.findByIdAndDelete(id).lean();
  }
}
