import express from 'express';
import userRoutes from './routes/userRoutes.js';

//Crear la app
const app = express();

//Routing
app.use('/', userRoutes);

//Definir un puerto y comenzar el proyecto
const port = 3000;
app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`)
});
