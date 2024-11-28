const express = require('express');
const router = express.Router();
const pool = require('../db');

const usuarios = async (req, res) => {
    try {
        const result = await pool.query('SELECT * from USUARIO ');
        res.status(200).json(result.rows);
        
    } catch (err) {
        res.status(500).send('Error en el stervidor');
        
    }
};
const usuarioId  = async(req,res)=>{
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
};

const vereficar = async (req, res) => {
    const { nombre, correo, contrasenya, direccion } = req.body;
    try {
        // Verificar si el correo ya existe
        const correoExistente = await pool.query('SELECT * FROM public.usuario WHERE correo = $1', [correo]);
        if (correoExistente.rows.length > 0) {
            return res.status(400).json({ error: 'El correo ya está en uso. Por favor, elige otro.' });
        }

        // Insertar el nuevo usuario
        const result = await pool.query(
            'INSERT INTO public.usuario (nombre, correo, contrasenya, direccion, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, correo, contrasenya, direccion, 'usuario']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};

const login = async (req, res) => {
    const { correo, contrasenya } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM usuario WHERE correo = $1',
            [correo]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('Correo no encontrado');
        }

        const usuario = result.rows[0];
        if (usuario.contrasenya !== contrasenya) {
            return res.status(401).send('Contraseña incorrecta');
        }

        res.status(200).json(usuario);
        console.info('Correo y contraseña verificados');
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};
module.exports = {
    usuarios,
    usuarioId,
    vereficar,
    login

}
