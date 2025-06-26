import { body } from 'express-validator';
export default [
  body('name').exists().withMessage('Topping name is required').isString().withMessage('Topping name should be a string'),
  body('price').exists().withMessage('Topping price is required').isNumeric().withMessage('Topping price should be a number'),
  body('tenantId').exists().withMessage('Tenant id field is required'),
  body('image').optional().isString().withMessage('Image should be a string'),
  body('isPublish').optional().isBoolean().withMessage('isPublish should be a boolean'),
];
