const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/carrito', async (req, res) => {
    const { id_usuario } = req.body;
    try {
        const newCart = await pool.query('INSERT INTO CARRITO (ID_USUARIO) VALUES ($1) RETURNING *', [id_usuario]);
        res.json(newCart.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
});

router.post('/carritoProducto', async (req, res) => {
    const { id_producto, id_carrito, cantidad, sub_total } = req.body;
    try {
        const newCartProduct = await pool.query('INSERT INTO carritoProducto (ID_PRODUCTO,ID_CARRITO,CANTIDAD,SUB_TOTAL) VALUES ($1, $2, $3, $4) RETURNING *', [id_producto, id_carrito, cantidad, sub_total]);
        res.json(newCartProduct.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
});

router.post('/agregarProductoAlCarrito', async (req, res) => {
    const { id_carrito, id_producto, cantidad } = req.body;
    try {
        await pool.query('SELECT agregar_producto_al_carrito($1, $2, $3)', [id_carrito, id_producto, cantidad]);
        res.status(200).send('Producto agregado al carrito exitosamente');
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
});


module.exports = router;