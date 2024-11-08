const express = require('express');
const router = express.Router();
const pool = require('../db');



// Obtener todos los usuarios
router.get('/usuario', async (req, res) => {
    try {
        const result = await pool.query('SELECT * from USUARIO ');
        res.status(200).json(result.rows);
        
    } catch (err) {
        res.status(500).send('Error en el stervidor');
        
    }
});

router.get('/usuario/:id',async(req,res)=>{
    const{id} =req.params;
    try{
        const result = await pool.query('SELECT *from uSUARIO WHERE ID_USUARIO = $1', [id]);
        if(result.rows.length === 0){
            return res.status(404).send('Usuarios no encontrado');
        }
        res.status(200).json(result.rows[0]);
    }catch(err){
        console.error('Error en el servidor',err);
        res.status(500).send('Error en el servidor');
    }
});

router.post('/usuario', async (req, res) => {
    const { nombre, correo, contrasenya, direccion} = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO public.usuario (nombre, correo, contrasenya, direccion, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, correo, contrasenya, direccion, 'usuario']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
});

router.post('/login', async (req, res) => {
    const { correo } = req.body;
    try {
        const result = await pool.query(
            'SELECT verificarCorreo($1)',
            [correo]
        );
        res.status(200).json(result.rows[0]);
        console.info('Correo verificado');
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
});


module.exports = router;
