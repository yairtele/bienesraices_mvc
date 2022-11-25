import express from 'express';
import userRoutes from './routes/userRoutes.js';

//Crear la app
const app = express();

//Habilitar Pug
app.set('view engine', 'pug');
app.set('views', './views');

//Routing
app.use('/auth', userRoutes);

//Definir un puerto y comenzar el proyecto
const port = 3000;
app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`)
});
