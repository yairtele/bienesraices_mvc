import nodemailer from 'nodemailer';

const registryEmail = async (data) => {
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    const {firstName, email, token} = data;

    //Send mail
    await transport.sendMail({
        from: 'RealEstate.com',
        to: email,
        subject: 'Confirm your account',
        text: 'Confirm your account',
        html: `
            <p>Hi ${firstName}, confirm your account on RealEstate.com</p>

            <p>Your account is ready, confirm it <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">here</a></p>

            <p>If you didn't create this account, you can ignore this message</p>
        `
    });
}

export {
    registryEmail
}