const express = require('express');
const router = express.Router();
const pool = require('../db');

const crearCarrito = async (req, res) => {
    const { id_usuario } = req.body;
    try {
        const newCart = await pool.query(
            'INSERT INTO CARRITO (ID_USUARIO) VALUES ($1) RETURNING id_carrito, id_usuario, activo', 
            [id_usuario]
        );
        res.json(newCart.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
}

const crearProductoCarrito =  async (req, res) => {
    const { id_producto, id_carrito, cantidad, precioventa } = req.body;
    try {
        const newCartProduct = await pool.query(
            'INSERT INTO carritoProducto (id_producto, id_carrito, cantidad, precioventa) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_producto, id_carrito, cantidad, precioventa]
        );
        res.json(newCartProduct.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};

const editarProductoCarrito = async (req, res) => {
    const { id_producto, id_carrito, cantidad, precioventa } = req.body;
    try {
        const updatedCartProduct = await pool.query(
            'UPDATE carritoProducto SET cantidad = $3, precioventa = $4 WHERE id_producto = $1 AND id_carrito = $2 RETURNING *',
            [id_producto, id_carrito, cantidad, precioventa]
        );
        if (updatedCartProduct.rows.length === 0) {
            return res.status(404).json({ error: 'Producto en carrito no encontrado' });
        }
        res.json(updatedCartProduct.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};


const detallePedido = async (req, res) => {
    const { id } = req.params;
    try {
        const carritoQuery = `
            SELECT id_carrito, activo
            FROM carrito
            WHERE id_carrito = $1
        `;
        const carritoResult = await pool.query(carritoQuery, [id]);
    
        if (carritoResult.rows.length === 0) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
    
        const carrito = carritoResult.rows[0];
    
        const productosQuery = `
            SELECT cp.id_producto, cp.cantidad, cp.precioventa, pr.nombre, pr.descripcion, pr.precio, pr.stock,
                   (cp.cantidad * pr.precio) AS total
            FROM carritoProducto cp
            JOIN producto pr ON cp.id_producto = pr.id_producto
            WHERE cp.id_carrito = $1
        `;
        const productosResult = await pool.query(productosQuery, [carrito.id_carrito]);
    
        carrito.productos = productosResult.rows;
    
        res.json(carrito);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
}
const editarCarrito = async (req, res) => {
    const { id_carrito, id_usuario, activo } = req.body;
    try {
        const updatedCart = await pool.query(
            'UPDATE carrito SET id_usuario = $2, activo = $3 WHERE id_carrito = $1 RETURNING *',
            [id_carrito, id_usuario, activo]
        );
        if (updatedCart.rows.length === 0) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(updatedCart.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};

module.exports = {
    crearCarrito,
    crearProductoCarrito,
    detallePedido,
    editarProductoCarrito,
    editarCarrito
};
