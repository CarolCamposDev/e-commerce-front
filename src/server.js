const express = require('express');
const app = express();

// Middleware para permitir CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Resto do código do servidor...

// Inicie o servidor
app.listen(3000, () => {
  console.log('Servidor em execução na porta 3000');
});
