const express = require('express');
const router = express.Router();
const pool = require('../db');

const crearPedido  = async (req, res) => {
    const { id_carrito, id_usuario, precio } = req.body;
    try {
        const newOrder = await pool.query('INSERT INTO PEDIDO (ID_CARRITO,ID_USUARIO,precio) VALUES ($1, $2, $3) RETURNING *', [id_carrito, id_usuario, precio]);
        res.json(newOrder.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};

const pedidosUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const result = await pool.query(`
            SELECT 
                p.id_pedido, p.precio as pedido_precio, p.fecha,
                c.id_carrito, c.activo,
                cp.id_producto, cp.cantidad, cp.precioventa,
                pr.nombre as producto_nombre, pr.descripcion, pr.precio as producto_precio
            FROM pedido p
            JOIN carrito c ON p.id_carrito = c.id_carrito
            JOIN carritoProducto cp ON c.id_carrito = cp.id_carrito
            JOIN producto pr ON cp.id_producto = pr.id_producto
            WHERE p.id_usuario = $1
        `, [id_usuario]);

        const pedidos = {};

        result.rows.forEach(row => {
            if (!pedidos[row.id_pedido]) {
                pedidos[row.id_pedido] = {
                    id_pedido: row.id_pedido,
                    pedido_precio: row.pedido_precio,
                    fecha: row.fecha,
                    carritos: {}
                };
            }

            if (!pedidos[row.id_pedido].carritos[row.id_carrito]) {
                pedidos[row.id_pedido].carritos[row.id_carrito] = {
                    id_carrito: row.id_carrito,
                    activo: row.activo,
                    productos: []
                };
            }

            pedidos[row.id_pedido].carritos[row.id_carrito].productos.push({
                id_producto: row.id_producto,
                cantidad: row.cantidad,
                producto_nombre: row.producto_nombre,
                descripcion: row.descripcion,
                producto_precio: row.producto_precio
            });
        });

        res.json(Object.values(pedidos));
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};

const todosPedidos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id_pedido, p.precio as pedido_precio, p.fecha,
                c.id_carrito, c.activo,
                cp.id_producto, cp.cantidad, cp.precioventa,
                pr.nombre as producto_nombre, pr.descripcion, pr.precio as producto_precio,
                u.id_usuario, u.nombre as usuario_nombre, u.correo, u.direccion
            FROM pedido p
            JOIN carrito c ON p.id_carrito = c.id_carrito
            JOIN carritoProducto cp ON c.id_carrito = cp.id_carrito
            JOIN producto pr ON cp.id_producto = pr.id_producto
            JOIN usuario u ON p.id_usuario = u.id_usuario
        `);

        const pedidos = {};

        result.rows.forEach(row => {
            if (!pedidos[row.id_pedido]) {
                pedidos[row.id_pedido] = {
                    id_pedido: row.id_pedido,
                    pedido_precio: row.pedido_precio,
                    fecha: row.fecha,
                    usuario: {
                        id_usuario: row.id_usuario,
                        nombre: row.usuario_nombre,
                        correo: row.correo,
                        direccion: row.direccion
                    },
                    carritos: {}
                };
            }

            if (!pedidos[row.id_pedido].carritos[row.id_carrito]) {
                pedidos[row.id_pedido].carritos[row.id_carrito] = {
                    id_carrito: row.id_carrito,
                    activo: row.activo,
                    productos: []
                };
            }

            pedidos[row.id_pedido].carritos[row.id_carrito].productos.push({
                id_producto: row.id_producto,
                cantidad: row.cantidad,
                producto_nombre: row.producto_nombre,
                descripcion: row.descripcion,
                producto_precio: row.producto_precio
            });
        });

        res.json(Object.values(pedidos));
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};

const carritoInactivo = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const result = await pool.query(`
            SELECT *
            FROM carrito
            WHERE id_usuario = $1 AND activo = false
        `, [id_usuario]);

        if (result.rows.length > 0) {
            res.json({ carrito: result.rows[0] });
        } else {
            res.json({ tieneCarritoInactivo: true });
        }
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};

module.exports = { 
    crearPedido,
    pedidosUsuario,
    todosPedidos,
    carritoInactivo 
};