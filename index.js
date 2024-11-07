const express = require('express');
const app = express();
const port = 3000;
const usuarioRoutes = require('./Src/Routes/usuario.routes');
const categoriaRoutes = require('./Src/Routes/categoria.routes')
const productoRoutes = require('./Src/Routes/producto.routes');
const carritoRoutes = require('./Src/Routes/carrito.routes');
const pedidoRoutes = require('./Src/Routes/pedido.routes');

app.use(express.json());

app.use('/api', usuarioRoutes);
app.use('/api',categoriaRoutes);
app.use('/api',productoRoutes);
app.use('/api',carritoRoutes);
app.use('/api',pedidoRoutes);



app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});