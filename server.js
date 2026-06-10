const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const dns = require('dns');

dns.setServers([
    '8.8.8.8',
    '8.8.4.4'
]);

const database = require('./database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(
    express.static(
        path.join(__dirname, 'public')
    )
);

app.use(
    '/api/peliculas',
    routes
);

database.conectar()
.then(() => {

    app.listen(PORT, () => {

        console.log(
            `✅ Servidor corriendo en http://localhost:${PORT}`
        );

    });

})
.catch(err => {

    console.error(err);

});