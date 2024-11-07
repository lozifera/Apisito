const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos las categorias 
router.get('/categoria', async (req, res) => {
    try {
        const result = await pool.query('SELECT *from CATEGORIA  ');
        res.status(200).json(result.rows);
        
    } catch (err) {
        res.status(500).send('Error en el servidor');
        
    }
});

router.post('/categoria',async(req,res)=>{
    const{nombre} = req.body;
    try{
        const newCategory = await pool.query('INSERT INTO CATEGORIA (NOMBRE) VALUES ($1) RETURNING *', [nombre]);
        res.json(newCategory.rows[0]);
    }catch(err){
        console.error('Error en el servidor',err);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;