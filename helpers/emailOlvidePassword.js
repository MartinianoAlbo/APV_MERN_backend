import nodemailer from 'nodemailer'

const emailOlvidePassword = async ({email, nombre, token}) => {

  //transportador
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })


  //Enviar email
  const info = await transport.sendMail({
    from: "APV - Administrador de pacientes de veterinaria",
    to: email,
    subject: 'Restablece tu password', //
    text: 'Restablece tu password', //
    html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password.</p>
      <p>
        Haz click en el siguiente enlace para generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>
      </p>

      <p>
        Si tu no creaste esta cuenta, puedes ignorar este mensaje
      </p>
    `
  })

  console.log('mensaje enviado: %s', info.messageId);

}

export default emailOlvidePassword;