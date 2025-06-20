import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { Category } from './category-types';
import { CategoryService } from './category-service';
import { Logger } from 'winston';

export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly logger: Logger,
  ) {
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }
    const { name, priceConfiguration, attributes } = req.body as Category;
    const category = await this.categoryService.create({
      name,
      priceConfiguration,
      attributes,
    });
    this.logger.info('created Category', { id: category._id });
    // call the service
    res.json({ id: category._id });
  }

  async getAll(req: Request, res: Response) {
    const categories = await this.categoryService.getAll();
    this.logger.info('fetched all categories');
    res.json(categories);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(createHttpError(400, 'Category ID is required'));
    }
    const category = await this.categoryService.getById(id);
    if (!category) {
      return next(createHttpError(404, 'Category not found'));
    }
    this.logger.info('fetched category by id', { id: category._id });
    res.json(category);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(createHttpError(400, 'Category ID is required'));
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }
    const { name, priceConfiguration, attributes } = req.body as Category;
    const category = await this.categoryService.update(id, {
      name,
      priceConfiguration,
      attributes,
    });
    if (!category) {
      return next(createHttpError(404, 'Category not found'));
    }
    this.logger.info('updated category', { id: category._id });
    res.json({ id: category._id });
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(createHttpError(400, 'Category ID is required'));
    }
    const category = await this.categoryService.delete(id);
    if (!category) {
      return next(createHttpError(404, 'Category not found'));
    }
    this.logger.info('deleted category', { id: category._id });
    res.json({ id: category._id });
  }
}
