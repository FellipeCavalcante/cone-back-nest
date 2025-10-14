export const registerEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bem-vindo ao Cone</title>
  <style>
    body {
      background-color: #f9fbfd;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #30e387, #9fafca);
      color: #fff;
      text-align: center;
      padding: 40px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 30px 25px;
      text-align: left;
    }
    .content h2 {
      color: #30e387;
      font-size: 22px;
      margin-bottom: 12px;
    }
    .content p {
      line-height: 1.6;
      color: #555;
      font-size: 16px;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      background-color: #30e387;
      color: #fff !important;
      padding: 12px 26px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      transition: background 0.3s;
    }
    .button:hover {
      background-color: #29cc76;
    }
    .footer {
      background-color: #f0f4fa;
      color: #9fafca;
      text-align: center;
      padding: 20px;
      font-size: 14px;
    }
    @media (max-width: 480px) {
      .content {
        padding: 20px;
      }
      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bem-vindo ao Cone 🚀</h1>
    </div>
    <div class="content">
      <h2>Olá, ${name}!</h2>
      <p>
        Estamos muito felizes em ter você conosco na <strong>PanthroDev</strong>!
        O <strong>Cone</strong> foi criado para simplificar e impulsionar o seu fluxo de trabalho,
        oferecendo performance, clareza e controle em cada detalhe.
      </p>
      <p>
        Agora que sua conta foi criada, você já pode fazer login e começar a explorar tudo o que preparamos pra você.
      </p>
      <p style="text-align: center;">
        <a href="https://cone.panthrodev.com/login" class="button">Acessar o Cone</a>
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} PanthroDev — Todos os direitos reservados.
    </div>
  </div>
</body>
</html>
`;
