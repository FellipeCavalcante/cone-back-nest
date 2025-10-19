export const registerEmailTemplate = (name: string, link: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Bem-vindo ao Cone</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f5f6fa;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 30px auto;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background-color: #0e387a;
      color: white;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
    }
    .content {
      padding: 30px;
      text-align: left;
    }
    .content h2 {
      color: #0e387a;
    }
    .content p {
      line-height: 1.6;
      font-size: 16px;
      color: #444;
    }
    .highlight {
      color: #0e387a;
      font-weight: bold;
    }
    .footer {
      background-color: #9fafca;
      text-align: center;
      padding: 15px;
      font-size: 14px;
      color: #fff;
    }
    .button {
      display: inline-block;
      background-color: #0e387a;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      text-decoration: none;
      margin-top: 20px;
    }
    .button:hover {
      background-color: #092d63;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bem-vindo ao Cone 🚀</h1>
    </div>

    <div class="content">
      <h2>Olá ${name}!</h2>
      <p>Obrigado por se cadastrar no <span class="highlight">Cone</span>, o produto desenvolvido pela <span class="highlight">PanthroDev</span> para facilitar sua jornada digital.</p>

      <p>A partir de agora, você faz parte de uma comunidade que acredita em tecnologia, inovação e simplicidade.</p>

      <p>Clique no botão abaixo para acessar sua conta e começar a explorar:</p>

      <a href="${link}" class="button">Acessar o Cone</a>

      <p>Se você não realizou este cadastro, por favor ignore este e-mail.</p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} PanthroDev — Todos os direitos reservados.
    </div>
  </div>
</body>
</html>
`;
