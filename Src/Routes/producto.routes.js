const express = require('express');
const router = express.Router();
const { createProducto, getProductos, getProductoCategoria, Img ,getImagenById,getProductoById,editProducto,deleteProducto} = require('../controllers/producto.controllers.js');



router.post('/producto/singel', Img.single('imagen'),createProducto );

router.put('/producto/singel/:id',Img.single('imagen'),editProducto);

router.delete('/producto/:id',deleteProducto);

router.get('/productos', getProductos);

router.get('/producto/imagen/:id', getImagenById);

router.get('/producto/:id', getProductoById);

router.get('/producto/categoria/:nombre', getProductoCategoria);

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