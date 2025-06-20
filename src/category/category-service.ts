import categoryModel from './category-model';
import { Category } from './category-types';

export class CategoryService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(category: Category) {
    const newCategory = new categoryModel(category);
    return newCategory.save();
  }

  async getAll(): Promise<Category[]> {
    const categories = await categoryModel.find().lean();
    return categories || [];
  }

  async getById(id: string) {
    return categoryModel.findById(id).lean();
  }

  async update(id: string, category: Category) {
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
