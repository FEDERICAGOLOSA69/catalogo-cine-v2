require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('CONECTADO');
    process.exit(0);
  })
  .catch(err => {
    console.error('ERROR COMPLETO:');
    console.error(err);
    process.exit(1);
  });