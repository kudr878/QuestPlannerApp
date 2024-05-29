const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function sendMailMessageAsync(listenerMail, code) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'quest.planner@internet.ru', 
      pass: 'BxcL5KpnfrcqkgYxVEM0', 
    },
  });


  const htmlBody = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Код подтверждения</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-image: url('https://example.com/background.jpg'); /* ссылка на фонового изображения */
              background-size: cover;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
          }
          .container {
              background-color: rgba(255, 255, 255, 0.8);
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
              max-width: 450px;
              width: 100%;
              text-align: center;
              animation: fadeIn 1s ease-in-out;
          }
          .container p {
              font-size: 18px;
              color: #333;
              margin-bottom: 20px;
          }
          .code {
              display: inline-block;
              font-size: 28px;
              font-weight: bold;
              padding: 15px;
              border: 2px dashed #4a90e2;
              border-radius: 5px;
              background-color: #f7f9fc;
              color: #4a90e2;
              animation: pulse 1.5s infinite;
          }
          .logo {
              width: 50px;
              height: 50px;
              margin-bottom: 20px;
          }
          @keyframes fadeIn {
              from {
                  opacity: 0;
                  transform: translateY(-20px);
              }
              to {
                  opacity: 1;
                  transform: translateY(0);
              }
          }
          @keyframes pulse {
              0% {
                  transform: scale(1);
              }
              50% {
                  transform: scale(1.05);
              }
              100% {
                  transform: scale(1);
              }
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="sftp://root@89.111.174.34/root/logoDark.png" alt="logo" class="logo">
          <p>Ваш код для подтверждения пароля:</p>
          <div class="code">${code}</div>
      </div>
  </body>
  </html>
  
`;

  const mailOptions = {
    from: 'quest.planner@internet.ru', 
    to: listenerMail,
    subject: 'Подтверждение пароля',
    html: htmlBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = {
  sendMailMessageAsync,
};