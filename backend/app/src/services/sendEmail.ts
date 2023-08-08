import nodemailer from "nodemailer";
import Log from "../middlewares/Log";

/**
 * Send Email to the user
 * @param  {string} email
 * @param  {string} subject
 * @param  {string} text
 */
let transporter: nodemailer.Transporter | null = null;

export const sendEmail = async (email: string, subject: string, text: string) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      if (!transporter) {
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: 'kale29@ethereal.email',
            pass: 'DPv14Qbv4mQRTFNDDT'
          }
        });
      }
      await transporter.sendMail({
        from: 'Example App <no-reply@example.com>',
        to: email,
        subject,
        text
      });
      Log.info(`Email sent to ${email}`);
    }
    return true;
  } catch (error) {
    Log.error(error);
    return false;
  }
};
  