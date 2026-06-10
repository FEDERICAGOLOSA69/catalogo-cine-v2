const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const peliculaSchema = new mongoose.Schema({

    titulo: String,
    genero: String,
    descripcion: String,

    precio: Number,

    fecha: String,

    horario1: String,
    horario2: String,
    horario3: String,

    imagen: String

});

const Pelicula = mongoose.model(
    'Pelicula',
    peliculaSchema
);

const compraSchema = new mongoose.Schema({

    pelicula: String,

    horario: String,

    asientos: [String],

    total: Number,

    fecha: {
        type: Date,
        default: Date.now
    }

});

const Compra = mongoose.model(
    'Compra',
    compraSchema
);


// OBTENER TODAS
router.get('/', async (req, res) => {

    const peliculas = await Pelicula.find();

    res.json(peliculas);

});

// GUARDAR
router.post('/', async (req, res) => {

    const pelicula = new Pelicula(
        req.body
    );

    await pelicula.save();

    res.status(201).json(
        pelicula
    );

});

// ELIMINAR
router.delete('/:id', async (req, res) => {

    const pelicula =
        await Pelicula.findById(
            req.params.id
        );

    console.log(
        "PELÍCULA A BORRAR:",
        pelicula?.titulo
    );

    if(pelicula){

        const resultado =
            await Compra.deleteMany({

                pelicula:
                    pelicula.titulo

            });

        console.log(
            "COMPRAS ELIMINADAS:",
            resultado.deletedCount
        );

    }

    await Pelicula.findByIdAndDelete(
        req.params.id
    );

    res.json({

        mensaje:
            'Película y compras eliminadas'

    });

});

// ACTUALIZAR
router.put('/:id', async (req, res) => {

    const pelicula =
        await Pelicula.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

    res.json(pelicula);

});

router.post('/compra', async (req, res) => {

    const compra = new Compra(
        req.body
    );

    await compra.save();

    res.status(201).json(
        compra
    );

});

router.get('/compras', async (req, res) => {

    const compras =
        await Compra.find()
        .sort({ fecha: -1 });

    res.json(compras);

});

router.get('/compras', async (req, res) => {

    const compras =
        await Compra.find()
        .sort({ fecha: -1 });

    res.json(compras);

});

router.get(
    '/asientos-ocupados/:pelicula/:horario',
    async (req, res) => {

        const compras =
            await Compra.find({

                pelicula:
                    req.params.pelicula,

                horario:
                    req.params.horario

            });

        let ocupados = [];

        compras.forEach(compra => {

            ocupados =
                ocupados.concat(
                    compra.asientos
                );

        });

        res.json(ocupados);

    }
);

module.exports = router;