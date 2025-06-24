import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { Filter, Product } from './product-types';
import { ProductService } from './product-service';
import { Logger } from 'winston';
import { FileStorage } from '../common/types/storage';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';
import { AuthRequest } from '../common/types';
import mongoose from 'mongoose';
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly logger: Logger,
    private readonly storage: FileStorage,
  ) {}

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

  async getAll(req: Request, res: Response) {
    const categories = await this.productService.getAll();
    this.logger.info('fetched all categories');
    res.json(categories);
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(createHttpError(400, 'Product ID is required'));
    }
    const product = await this.productService.getProduct(id);
    if (!product) {
      return next(createHttpError(404, 'Product not found'));
    }
    const tenantId = (req as AuthRequest).auth.tenant;
    if ((req as AuthRequest).auth.role !== 'admin') {
      if (product?.tenantId !== tenantId) {
        return next(createHttpError(403, 'Access denied to this product'));
      }
    }
    this.logger.info('fetched Product by id', { id });
    res.json(product);
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    if (!productId) {
      return next(createHttpError(400, 'Product ID is required'));
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg as string));
    }

    const Product = await this.productService.getProduct(productId);
    if (!Product) {
      return next(createHttpError(404, 'Product not found'));
    }

    const TenantId = (req as AuthRequest).auth.tenant;
    if ((req as AuthRequest).auth.role !== 'admin') {
      if (Product.tenantId !== TenantId) {
        return next(createHttpError(403, 'Access denied to this product'));
      }
    }

    let imageName = null; // Initialize imageName to null
    if (req.files?.image) {
      const oldImage = Product.image; // Store the old image name to delete it later
      const image = req.files.image as UploadedFile;
      imageName = uuidv4(); // Generate a unique name for the image
      await this.storage.upload({
        fileName: imageName,
        fileData: image.data.buffer,
      });
      // Delete the old image from storage
      if (oldImage) {
        this.storage.delete(oldImage);
      }
      req.body.image = imageName; // Update the image name in the request body
    }
    const { name, description, priceConfiguration, attributes, tenantId, categoryId, isPublish } = req.body;
    const products = {
      name,
      description,
      priceConfiguration: JSON.parse(priceConfiguration), // Assuming priceConfiguration is a JSON string
      attributes: JSON.parse(attributes), // Assuming attributes is a JSON string
      tenantId,
      categoryId,
      isPublish, // req.file ? req.file.filename : null, // Assuming you are using multer for file uploads  req.body.image
      ...(imageName && { image: imageName }),
    };

    const product = await this.productService.updateProduct(productId, products);
    if (!products) {
      return next(createHttpError(404, 'Products not found'));
    }
    this.logger.info('updated Products', { id: product?._id });
    res.json({ id: productId });
  };

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(createHttpError(400, 'Category ID is required'));
    }
    const category = await this.productService.delete(id);
    if (!category) {
      return next(createHttpError(404, 'Category not found'));
    }
    this.logger.info('deleted category', { id });
    res.json({ id });
  }

  index = async (req: Request, res: Response) => {
    const { q, tenantId, categoryId, isPublish } = req.query;
    const filters: Filter = {};

    if (isPublish === 'true') {
      filters.isPublish = true;
    }

    if (tenantId) {
      filters.tenantId = tenantId as string;
    }

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId as string)) {
      filters.categoryId = new mongoose.Types.ObjectId(categoryId as string);
    }

    const products = await this.productService.getProducts(q as string, filters, {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    });
    // const filteredProducts = products.filter((product) => product.tenantId === tenantId);
    res.json(products);
  };
}
