import { transporter } from '../config/nodemailer';

interface IAuthEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IAuthEmail) => {
    await transporter.sendMail({
      from: 'UpTask <ClowReed@uptask.com>',
      to: user.email,
      subject: 'UpTask - Confirma tu cuenta',
      text: 'UpTask - Confirma tu cuenta',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <h1 style="color: #4CAF50;">Hola, ${user.name}</h1>
        <p style="font-size: 16px;">has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta.</p>
        <p>Visita el siguiente enlace para confirmarla:</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account" 
           style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; 
                  text-decoration: none; font-size: 16px; margin: 10px 0;">
          Confirmar cuenta
        </a>
        <p>E ingresa el siguiente código:</p>
        <p style="font-size: 18px; font-weight: bold;">${user.token}</p>
        <p style="font-size: 14px; color: #555;">Este Token expira en 10 minutos</p>
        <p style="font-size: 14px; color: #999;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
      </div>
    `,
    });
  };

  static sendPasswordResetToken = async (user: IAuthEmail) => {
    await transporter.sendMail({
      from: 'UpTask <ClowReed@uptask.com>',
      to: user.email,
      subject: 'UpTask - Restablece tú Password',
      text: 'UpTask - Restablece tú Password',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <h1 style="color: #4CAF50;">Hola, ${user.name}</h1>
        <p style="font-size: 16px;">Has solicitado restablecer tu contraseña.</p>
        <p>Visita el siguiente enlace para restablecerla:</p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password" 
           style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; 
                  text-decoration: none; font-size: 16px; margin: 10px 0;">
          Restablecer Password
        </a>
        <p>e ingresa el siguiente código:</p>
        <p style="font-size: 18px; font-weight: bold;">${user.token}</p>
        <p style="font-size: 14px; color: #555;">Este Token expira en 10 minutos</p>
        <p style="font-size: 14px; color: #999;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
      </div>
    `,
    });
  };
}
