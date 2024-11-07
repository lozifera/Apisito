const express = require('express');
const multer = require('multer');
const fs = require('node:fs');
const router = express.Router();
const pool = require('../db');


const Img = multer({dest: 'Img/'});

router.post('/producto/singel', Img.single('imagen'), async (req, res) => {
    console.log(req.file);
    const imagePath = saveImage(req.file);
    try {
        const { nombre, descripcion, precio, stock, id_categoria } = req.body;
        const newProduct = await pool.query(
            `INSERT INTO public.producto (nombre, descripcion, img, precio, stock, id_categoria) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombre, descripcion, imagePath, precio, stock, id_categoria]
        );
        res.json(newProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

function saveImage(file){
    const newPath = `./Img/${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath; 
}



router.get('/producto', async (req, res) => {
    try {
        const result = await pool.query('SELECT * from PRODUCTO  ');
        res.status(200).json(result.rows);
        
    } catch (err) {
        res.status(500).send('Error en el servidor');
        
    }
});

router.get('/producto/categoria/:nombre', async (req, res) => {
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
});

module.exports = router;


/*router.post('/images/singel', Img.single('imagen'), (req, res) => {
    console.log(req.file);
    saveImage(req.file);
    res.send('Imagen subida');
});*/ 

/*router.post('/producto',async(req,res)=>{
    const{nombre,descripcion,img,precio,stock,ide_categoria} = req.body;
    try{
        const newProduct = await pool.query('INSERT INTO PRODUCTO (NOMBRE,DESCRIPCION,IMG,PRECIO,STOCK,ID_CATEGORIA) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [nombre,descripcion,img,precio,stock,ide_categoria]);
        res.json(newProduct.rows[0]);
    }catch(err){
        console.error('Error en el servidor',err);
        res.status(500).send('Error en el servidor');
    }

});*/ 