const express = require('express');
const router = express.Router();
const pool = require('../db');
const {crearCarrito,crearProductoCarrito,detallePedido,editarProductoCarrito,editarCarrito} = require('../controllers/carrito.controllers');

router.post('/carrito',crearCarrito );

router.post('/carritoProducto',crearProductoCarrito);

router.put('/carrito',editarCarrito);

router.put('/carritoProducto',editarProductoCarrito);

router.get('/carrito/:id',detallePedido);



module.exports = router;