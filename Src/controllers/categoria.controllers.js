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

const crearCategoria = async (req, res) => {
    console.log(req.file);
    const { nombre } = req.body;
    const imagePath = req.file.path;
    const filename = req.file.filename;
    try {
        const newCategory = await pool.query(
            'INSERT INTO public.categoria (nombre, filename, "path") VALUES ($1, $2, $3) RETURNING *',
            [nombre, filename, imagePath]
        );
        res.json(newCategory.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};
const editarCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const imagePath = req.file ? req.file.path : null;
    const filename = req.file ? req.file.filename : null;

    try {
        let query = 'UPDATE public.categoria SET nombre = $1';
        let values = [nombre];

        if (imagePath && filename) {
            query += ', filename = $2, "path" = $3 WHERE id_categoria = $4 RETURNING *';
            values.push(filename, imagePath, id);
        } else {
            query += ' WHERE id_categoria = $2 RETURNING *';
            values.push(id);
        }

        const updatedCategory = await pool.query(query, values);
        res.json(updatedCategory.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};
const deleteCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM public.categoria WHERE id_categoria = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Categoría no encontrada');
        }
        res.status(200).json({ message: 'Categoría eliminada correctamente' });
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};


const getCategoriaById = async (req, res) =>{
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM public.categoria WHERE id_categoria = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Categoría no encontrada');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error en el servidor', err);
        res.status(500).send('Error en el servidor');
    }
};
const getCategories = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM CATEGORIA');
        res.status(200).json(result.rows);
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
        const result = await pool.query('SELECT * FROM public.categoria WHERE id_categoria = $1', [id]);

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
    crearCategoria,
    Img,
    getCategories,
    editarCategoria,
    getImagenById,
    getCategoriaById,
    deleteCategoria
};