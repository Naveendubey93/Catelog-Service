import { ProductController } from './product-controller';
import express, { Request, Response, NextFunction } from 'express';
import productValidator from './product-validator';
import { ProductService } from './product-service';
import logger from '../config/logger';
import { asyncWrapper } from '../utils/wrapper';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { Roles } from '../common/constants';
const router = express.Router();

const productService = new ProductService();
const productController = new ProductController(productService, logger);
router.post('/', productValidator, (req: Request, res: Response, next: NextFunction) => productController.create(req, res, next));

router.post('/', authenticate, canAccess([Roles.ADMIN]), productValidator, asyncWrapper(productController.create));
// router.put('/', authenticate, canAccess([Roles.ADMIN]), categoryValidator, asyncWrapper(categoryController.create));
// router.get('/', asyncWrapper(ProductController.getAll));
// router.get('/:id', asyncWrapper(ProductController.getById));
// router.put('/:id', authenticate, canAccess([Roles.ADMIN]), productValidator, asyncWrapper(ProductController.update));
// router.delete('/:id', authenticate, canAccess([Roles.ADMIN]), asyncWrapper(categoryController.delete));
// router.delete('/:id', authenticate, canAccess([Roles.ADMIN]), asyncWrapper(ProductController.delete));

export default router;
