import { CategoryController } from './category-controller';
import express from 'express';
import categoryValidator from './category-validator';
import { CategoryService } from './category-service';
import logger from '../config/logger';
import { asyncWrapper } from '../utils/wrapper';
import authenticate from '../common/middlewares/authenticate';
import { canAccess } from '../common/middlewares/canAccess';
import { Roles } from '../common/constants';
const router = express.Router();

const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService, logger);
// router.post('/', categoryValidator, (req: Request, res: Response, next: NextFunction) => categoryController.create(req, res, next));

router.post('/', authenticate, canAccess([Roles.ADMIN]), categoryValidator, asyncWrapper(categoryController.create));
// router.put('/', authenticate, canAccess([Roles.ADMIN]), categoryValidator, asyncWrapper(categoryController.create));
router.get('/', asyncWrapper(categoryController.getAll));
router.get('/:id', asyncWrapper(categoryController.getById));
router.put('/:id', authenticate, canAccess([Roles.ADMIN]), categoryValidator, asyncWrapper(categoryController.update));
// router.delete('/:id', authenticate, canAccess([Roles.ADMIN]), asyncWrapper(categoryController.delete));
router.delete('/:id', authenticate, canAccess([Roles.ADMIN]), asyncWrapper(categoryController.delete));

export default router;
