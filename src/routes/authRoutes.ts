import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

router.post(
  '/create-account',
  body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('El password no puede ser mayor a 8 caracteres'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  }),
  body('email').isEmail().withMessage('E-mail no válido'),
  handleInputErrors,
  AuthController.createAccount
);

export default router;
