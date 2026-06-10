const mongoose = require('mongoose');

async function conectar() {

    await mongoose.connect(
        process.env.MONGODB_URI
    );

    console.log('📦 MongoDB conectado');
}

module.exports = { conectar };