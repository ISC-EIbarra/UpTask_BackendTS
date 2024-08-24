import type { Request, Response } from 'express';
import User from '../models/User';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import Token from '../models/Token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Prevent duplicate
      const userExist = await User.findOne({ email });
      if (userExist) {
        const error = new Error('El e-mail ya está asociado a una cuenta');
        return res.status(409).json({ error: error.message });
      }
      const user = new User(req.body);

      //Hash Password
      user.password = await hashPassword(password);

      //Generate Token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //Send Email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send('Cuenta creada, revisa tu e-mail para confirmarla');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error('Token no válido');
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send('Cuenta confirmada correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({ error: error.message });
      }
      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        //Send Email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          'La cuenta no se ha confirmado aún, hemos enviado un e-mail de confirmación'
        );
        return res.status(401).json({ error: error.message });
      }

      // Check password
      const isPasswordCorrect = await checkPassword(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error('La contraseña es incorrecta');
        return res.status(401).json({ error: error.message });
      }

      res.send('Autenticado...');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Usuario Existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('El usuario no está registrado');
        return res.status(404).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error('El usuario ya está confirmado');
        return res.status(403).json({ error: error.message });
      }

      //Generate Token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //Send Email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send('Se envió un nuevo Token a tú e-mail');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Usuario Existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error('El usuario no está registrado');
        return res.status(404).json({ error: error.message });
      }

      //Generate Token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      //Send Email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send('Revisa tu e-mail para instrucciones');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error('Token no válido');
        return res.status(404).json({ error: error.message });
      }
      res.send('Token valido, define tú nuevo password');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const tokenExist = await Token.findOne({ token });

      if (!tokenExist) {
        const error = new Error('Token no válido');
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.password = await hashPassword(password);

      await Promise.allSettled([tokenExist.deleteOne(), user.save()]);

      res.send('El password se modificó correctamente');
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' });
    }
  };
}
