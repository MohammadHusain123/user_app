import * as nodemailer from 'nodemailer';

export class EmailService {
    static async sendEmail(to: string, subject: string, message: string) {

        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: `
            <head>
                
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
                
                <link href="https://fonts.googleapis.com/css?family=Ubuntu+Mono" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">
                
            </head>
            <body leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
               <h3>Password link:-</h3>
               <p>${message}</p>
            </body>
            `,
        };

        try {
            return await transporter.sendMail(mailOptions);
        } catch (error) {
            return { error: `Failed to send email to ${to}` };
        }
    }
}
