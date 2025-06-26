import { PaginateOptions } from 'mongoose';
import { Filter } from '../product/product-types';
import toppingModel from './topping-model';
import { Topping } from './topping-types';

export class ToppingService {
  async createTopping(topping: Topping) {
    return toppingModel.create(topping);
  }

  async getAll() {
    const toppings = await toppingModel.find().lean();
    return toppings;
  }

  async getById(id: string) {
    return toppingModel.findById(id);
  }

  async getTopping(toppingId: string) {
    return await toppingModel.findOne({ _id: toppingId });
  }

  async getToppings(q: string, filters: Filter, paginateQuery: PaginateOptions) {
    const searchQueryRegexp = new RegExp(q, 'i');
    const filterQuery = {
      ...filters,
      name: searchQueryRegexp,
    };
    const aggregate = toppingModel.aggregate([
      {
        $match: filterQuery,
      },
    ]);

    // The result is a paginated object, not a Topping[]
    return toppingModel.aggregatePaginate(aggregate, { ...paginateQuery, customLabels: { totalDocs: 'total', docs: 'items' } });
  }

  async getToppingImage(id: string) {
    const topping = await toppingModel.findById(id);
    if (!topping || !topping.image) {
      throw new Error('Topping not found or image not available');
    }
    return topping.image;
  }

  async updateTopping(id: string, topping: Partial<Topping>) {
    return toppingModel.findByIdAndUpdate(id, topping, { new: true });
  }
}
