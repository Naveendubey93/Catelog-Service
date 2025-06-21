import { body } from 'express-validator';
export default [
  body('name').exists().withMessage('Product name is required').isString().withMessage('Product name should be a string'),
  body('description').exists().withMessage('Product description is required'),
  body('priceConfiguration').exists().withMessage('Price configuration is required'),
  body('attributes').exists().withMessage('Attributes field is required'),
  body('tenantId').exists().withMessage('Tenant id field is required'),
  body('categoryId').exists().withMessage('Tenant id field is required'),
  // body('image')
  //   .custom((value, { req }) => {
  //     if (!value && !req.file) {
  //       throw new Error('Product Image is required');
  //     }
  //   })
  //   .withMessage('Image id field is required'),
];
