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
      html: `<p>Hola: ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta.</p>
      <p>Visita el siguiente enlace: </p>
      <a href="">Confirmar cuenta</a>
      <p>E ingresa el siguiente código: <b>${user.token}</b></p>
      <p>Este Token expira en 10 minutos</p>
      `,
    });
  };
}
