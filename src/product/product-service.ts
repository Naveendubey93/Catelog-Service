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
    return productModel.findById(id);
  }

  async getProductImage(id: string) {
    const product = await productModel.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    if (!product.image) {
      throw new Error('Product image not found');
    }
    return product.image;
  }

  async update(id: string, category: Product) {
    return productModel
      .findByIdAndUpdate(id, category, {
        new: true,
        runValidators: true,
      })
      .lean();
  }

  updateProduct = async (productId: string, product: Product) => {
    return productModel.findOneAndUpdate(
      { _id: productId },
      { $set: product },
      {
        new: true,
        runValidators: true,
      },
    );
  };

  async delete(id: string) {
    return productModel.findByIdAndDelete(id).lean();
  }
}
