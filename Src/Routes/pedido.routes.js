const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/pedido', async (req, res) => {
    const { id_carrito, id_usuario, precio } = req.body;
    try {
        const newOrder = await pool.query('INSERT INTO PEDIDO (ID_CARRITO,ID_USUARIO,precio) VALUES ($1, $2, $3) RETURNING *', [id_carrito, id_usuario, precio]);
        res.json(newOrder.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;