import type { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/Auth';

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const user = new User(req.body);
      //Hash Password
      user.password = await hashPassword(password);
      await user.save();
      res.send('Cuenta creada, revisa tu e-mail para confirmarla');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };
}
