import productModel from './product-model';
import { Filter, Product } from './product-types';

export class ProductService {
  async createProduct(product: Product) {
    return productModel.create(product);
  }

  async getAll() {
    const categories = await productModel.find().lean();
    return categories;
  }

  async getById(id: string) {
    return productModel.findById(id);
  }

  async getProduct(productId: string): Promise<Product | null> {
    return await productModel.findOne({ _id: productId });
  }

  async getProducts(q: string, filters: Filter): Promise<Product[] | null> {
    const searchQueryRegexp = new RegExp(q, 'i');
    const filterQuery = {
      ...filters,
      name: searchQueryRegexp,
    };
    const aggregate = productModel.aggregate([
      {
        $match: filterQuery,
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                attributes: 1,
                priceConfiguration: 1,
              },
            },
          ],
        },
      },
      { $unwind: '$category' },
    ]);

    const result = aggregate.exec();
    return result as unknown as Product[] | null;
    // return await productModel.findOne({ _id: productId });
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
