const fs = require('node:fs');
const path = require('path');
const pool = require('../db');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = process.env.UPLOADS_PATH;
        // Verifica si la carpeta existe, si no, créala
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Renombra el archivo para evitar conflictos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const Img = multer({ storage: storage });

const createProducto = async (req, res) => {
    console.log(req.file);
    const { nombre, descripcion, precio, stock, id_categoria } = req.body;
    const imagePath = req.file.path;
    const filename = req.file.originalname;
    try {
        const newProduct = await pool.query(
            `INSERT INTO public.producto (nombre, descripcion, filename, "path", precio, stock, id_categoria) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [nombre, descripcion, filename, imagePath, precio, stock, id_categoria]
        );
        res.json(newProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
const editProducto = async (req, res) => {
    console.log(req.file);
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, id_categoria } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const filename = req.file ? req.file.filename : null;
    try {
        let updateQuery = `
            UPDATE public.producto 
            SET nombre = $1, descripcion = $2, precio = $3, stock = $4, id_categoria = $5`;
        
        const values = [nombre, descripcion, precio, stock, id_categoria];

        if (imagePath && filename) {
            updateQuery += `, filename = $6, "path" = $7 WHERE id_producto = $8 RETURNING *`;
            values.push(filename, imagePath, id);
        } else {
            updateQuery += ` WHERE id_producto = $6 RETURNING *`;
            values.push(id);
        }
        
        const updatedProduct = await pool.query(updateQuery, values);
        res.json(updatedProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
const deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM public.producto WHERE id_producto = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('Producto no encontrado');
        }

        res.status(200).json({ mensaje: 'Producto eliminado correctamente', producto: result.rows[0] });
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};


const getProductoById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM public.producto WHERE id_producto = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('Producto no encontrado');
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error al obtener el producto');
    }
};
const getProductos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * from PRODUCTO  ');
        res.status(200).json(result.rows);
        
    } catch (err) {
        res.status(500).send('Error en el servidor');
        
    }
};


const getProductoCategoria = async (req, res) => {
    const categoriaNombre = req.params.nombre;
    try {
        // Obtener el ID de la categoría basado en el nombre
        const categoriaResult = await pool.query('SELECT id_categoria FROM CATEGORIA WHERE NOMBRE = $1', [categoriaNombre]);
        console.log(categoriaResult.rows);
        if (categoriaResult.rows === 0) {
            return res.status(404).send('Categoría no encontrada');
        }
        const categoriaId = categoriaResult.rows[0].id_categoria;

        // Obtener los productos basados en el ID de la categoría
        const productosResult = await pool.query('SELECT * FROM PRODUCTO WHERE id_categoria = $1', [categoriaId]);
        res.status(200).json(productosResult.rows);
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
};
const getMimeType = (fileName) => {
    const extension = path.extname(fileName.toLowerCase());
    switch (extension) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        default:
            return 'image/jpeg';
    }
};
const getImagenById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM public.producto WHERE id_producto = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('Imagen no encontrada');
        }

        const imagen = result.rows[0];

        fs.readFile(imagen.path, (err, data) => {
            if (err) {
                return res.status(404).send('Imagen no encontrada');
            }
            const contentType = getMimeType(imagen.filename);
            res.setHeader('Content-Type', contentType);
            res.send(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la imagen');
    }
};
module.exports = {
    createProducto,
    getProductos,
    getProductoCategoria,
    Img,
    getImagenById,
    getProductoById,
    editProducto,
    deleteProducto
};