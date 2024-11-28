const express = require('express');
const router = express.Router();
const pool = require('../db');
const { usuarios,usuarioId,vereficar,login } = require('../controllers/usuario.controllers');


// Obtener todos los usuarios
router.get('/usuarios',usuarios );

router.get('/usuario/:id',usuarioId);

router.post('/usuario',vereficar );

router.post('/login',login );

module.exports = router;

module.exports = router;
