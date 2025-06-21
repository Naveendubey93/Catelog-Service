import { ProductController } from './product-controller';
import express from 'express';
import productValidator from './productupdate-validator';
import { ProductService } from './product-service';
import logger from '../config/logger';
import { asyncWrapper } from '../utils/wrapper';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { Roles } from '../common/constants';
import fileUpload from 'express-fileupload';
import { S3Storage } from '../common/services/s3Services';
import createHttpError from 'http-errors';
const router = express.Router();

const productService = new ProductService();
const storageService = new S3Storage();
const productController = new ProductController(productService, logger, storageService);
// router.post('/', productValidator, (req: Request, res: Response, next: NextFunction) => productController.create(req, res, next));

router.post(
  '/',
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: { fileSize: 500 * 1000 } /* 500 kb */,
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
      const error = createHttpError(400, 'File size limit exceeded');
      next(error);
    },
  }),
  productValidator,
  asyncWrapper(productController.create),
);
router.put(
  '/:productId',
  authenticate,
  canAccess([Roles.ADMIN, Roles.MANAGER]),
  fileUpload({
    limits: { fileSize: 500 * 1000 } /* 500 kb */,
    abortOnLimit: true,
    limitHandler: (req, res, next) => {
      const error = createHttpError(400, 'File size limit exceeded');
      next(error);
    },
  }),
  productValidator,
  asyncWrapper(productController.update),
);
// router.get('/', asyncWrapper(ProductController.getAll));
router.get('/:id', authenticate, asyncWrapper(productController.getProduct.bind(productController)));
// router.put('/:id', authenticate, canAccess([Roles.ADMIN]), productValidator, asyncWrapper(ProductController.update));
// router.delete('/:id', authenticate, canAccess([Roles.ADMIN]), asyncWrapper(categoryController.delete));
// router.delete('/:id', authenticate, canAccess([Roles.ADMIN]), asyncWrapper(ProductController.delete));

export default router;
