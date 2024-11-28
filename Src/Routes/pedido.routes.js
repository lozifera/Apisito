const express = require('express');
const router = express.Router();
const pool = require('../db');
const { crearPedido,pedidosUsuario,todosPedidos,carritoInactivo } = require('../controllers/pedido.controllers');

router.post('/pedido',crearPedido );

router.get('/pedidos/:id_usuario',pedidosUsuario );

router.get('/pedidos', todosPedidos);

router.get('/carrito/inactivo/:id_usuario',carritoInactivo );

module.exports = router;