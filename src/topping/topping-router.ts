import fileUpload from 'express-fileupload';
import { S3Storage } from '../common/services/s3Services';
import logger from '../config/logger';
import { ToppingController } from './topping-controller';
import { ToppingService } from './topping-service';
import express from 'express';
const router = express.Router();
const storageService = new S3Storage();
const toppingService = new ToppingService();
const toppingController = new ToppingController(toppingService, logger, storageService);
import createHttpError from 'http-errors';
import { asyncWrapper } from '../utils/wrapper';
import toppingValidator from './topping-validator';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { Roles } from '../common/constants';

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
  toppingValidator,
  asyncWrapper(toppingController.createTopping.bind(toppingController)),
);

router.get('/', authenticate, asyncWrapper(toppingController.getAllToppings.bind(toppingController)));
router.get('/:id', authenticate, asyncWrapper(toppingController.getTopping.bind(toppingController)));

export default router;
