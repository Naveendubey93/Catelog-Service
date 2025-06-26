import { Logger } from 'winston';
import { FileStorage } from '../common/types/storage';
import { ToppingService } from './topping-service';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import { Topping } from './topping-types';
import { Filter } from '../product/product-types';
import { AuthRequest } from '../common/types';
export class ToppingController {
  constructor(
    private readonly toppingService: ToppingService,
    private readonly logger: Logger,
    private readonly storage: FileStorage,
  ) {}

  async createTopping(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      // console.log('Validation result:', result);
      if (!result.isEmpty()) {
        return next(createHttpError(400, result.array()[0].msg as string));
      }

      const image = req.files ? (req.files.image as UploadedFile) : undefined; // Assuming you are using multer for file uploads
      const imageName = uuidv4(); // Generate a unique name for the image
      if (image) {
        await this.storage.upload({
          fileName: imageName,
          fileData: image.data.buffer,
        });
      }
      const { name, price, tenantId, isPublish } = req.body; // Assuming the topping data is in the request body
      // Validate the topping data here if needed
      const toppings = {
        name,
        image: imageName, // Use the generated image name
        price: parseFloat(price), // Ensure price is a number
        tenantId: tenantId, // Assuming tenantId is passed in the request body
        isPublish: isPublish === 'true', // Convert to boolean if needed
      };

      const newTopping = await this.toppingService.createTopping(toppings as Topping);
      this.logger.info('Created Topping', { id: newTopping._id });
      res.json({ id: newTopping._id });
    } catch (error) {
      next(error);
    }
  }

  async getAllToppings(req: Request, res: Response, next: NextFunction) {
    const { q, tenantId, isPublish } = req.query;
    const filters: Filter = {};
    if (tenantId) {
      filters.tenantId = tenantId as string;
    }
    if (isPublish) {
      filters.isPublish = isPublish === 'true'; // Convert to boolean if needed
    }
    /*

      const products = await this.productService.getProducts(q as string, filters, {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      });
      // const filteredProducts = products.filter((product) => product.tenantId === tenantId);
      const dataArray = Array.isArray(products?.data) ? products.data : [];

    */
    const toppings = await this.toppingService.getToppings(q as string, filters, {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    });

    if (!toppings) {
      return next(createHttpError(400, 'Topping not found'));
    }
    const dataArray = Array.isArray(toppings?.data) ? toppings.data : [];

    const finalProducts = dataArray.map((items: Topping) => {
      return {
        ...items,
        image: items.image ? this.storage.getObjectUrl(items.image) : null, // Assuming getObjectUrl is a method in FileStorage
      };
    });
    toppings.data = finalProducts;

    res.json(toppings);
    res.json({
      data: finalProducts,
      total: toppings.total,
      page: toppings.limit,
      limit: toppings.page,
    });
  }

  async updateTopping(req: Request, res: Response, next: NextFunction) {
    try {
      const toppingId = req.params.id;
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(createHttpError(400, result.array()[0].msg as string));
      }

      const image = req.files ? (req.files.image as UploadedFile) : undefined;
      let imageName = undefined;
      if (image) {
        imageName = uuidv4(); // Generate a unique name for the image
        await this.storage.upload({
          fileName: imageName,
          fileData: image.data.buffer,
        });
      }
      const { name, trnantId, price, isPublish } = req.body; // Assuming the topping data is in the request body
      // Validate the topping data here if needed
      const toppings = {
        name,
        image: imageName, // Use the generated image name
        price: parseFloat(price), // Ensure price is a number
        tenantId: trnantId, // Assuming tenantId is passed in the request body
        isPublish: isPublish === 'true', // Convert to boolean if needed
      };

      const updatedTopping = await this.toppingService.updateTopping(toppingId, toppings as Topping);
      this.logger.info('Updated Topping', { id: updatedTopping?._id });
      res.json({ id: updatedTopping?._id });
    } catch (error) {
      this.logger.error('Error updating topping', { error });
      next(error);
    }
  }

  async getTopping(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) {
      return next(createHttpError(400, 'Product ID is required'));
    }
    const topping = await this.toppingService.getTopping(id);
    if (!topping) {
      return next(createHttpError(404, 'Product not found'));
    }
    const tenantId = (req as AuthRequest).auth.tenant;
    if ((req as AuthRequest).auth.role !== 'admin') {
      if (topping?.tenantId !== tenantId) {
        return next(createHttpError(403, 'Access denied to this product'));
      }
    }
    this.logger.info('fetched Product by id', { id });
    res.json(topping);
  }
}
