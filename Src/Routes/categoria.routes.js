const express = require('express');
const router = express.Router();
const { crearCategoria, Img, getCategories, editarCategoria,getImagenById,getCategoriaById,deleteCategoria } = require('../controllers/categoria.controllers.js');



router.post('/categoria/singel',Img.single('imagen'),crearCategoria);

router.put('/categoria/:id',Img.single('imagen'),editarCategoria);

router.delete('/categoria/:id', deleteCategoria);

router.get('/categorias', getCategories); 

router.get('/categoria/:id', getCategoriaById);

router.get('/categoria/imagen/:id', getImagenById);




module.exports = router;