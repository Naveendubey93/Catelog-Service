import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { Product } from './product-types';
import { ProductService } from './product-service';
import { Logger } from 'winston';
import { FileStorage } from '../common/types/storage';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly logger: Logger,
    private readonly storage: FileStorage,
  ) {
    // this.create = this.create.bind(this);
    // this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.update = this.update.bind(this);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const {
      name,
      description,
      priceConfiguration,
      attributes,
      tenantId,
      categoryId,
      // image, // Assuming you are using multer for file uploads
      isPublish,
    } = req.body;
    const image = req.files ? (req.files.image as UploadedFile) : undefined; // Assuming you are using multer for file uploads
    const imageName = uuidv4(); // Generate a unique name for the image
    if (image) {
      await this.storage.upload({
        fileName: imageName,
        fileData: image.data.buffer,
      });
    }
    const product = {
      name,
      description,
      priceConfiguration: JSON.parse(priceConfiguration), // Assuming priceConfiguration is a JSON string
      attributes: JSON.parse(attributes), // Assuming attributes is a JSON string
      tenantId,
      categoryId,
      isPublish, // req.file ? req.file.filename : null, // Assuming you are using multer for file uploads  req.body.image
      image: imageName,
    };

    const newProduct = await this.productService.createProduct(product as Product);
    this.logger.info('Created Product', { id: newProduct._id });
    // call the service
    res.json({ id: newProduct._id });
  };

  // async getAll(req: Request, res: Response) {
  //   const categories = await this.productService.getAll();
  //   this.logger.info('fetched all categories');
  //   res.json(categories);
  // }

  async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(createHttpError(400, 'Category ID is required'));
    }
    const category = await this.productService.getById(id);
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
    const { name, priceConfiguration, attributes } = req.body as Product;
    const category = await this.productService.update(id, {
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
    const category = await this.productService.delete(id);
    if (!category) {
      return next(createHttpError(404, 'Category not found'));
    }
    this.logger.info('deleted category', { id: category._id });
    res.json({ id: category._id });
  }
}
