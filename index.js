import express from 'express';
import userRoutes from './routes/userRoutes.js';
import db from './config/db.js';

//Creating the app
const app = express();

//Get forms data
app.use(express.urlencoded({extended: true}));

//Database connection
try{
  await db.authenticate();
  db.sync();
  console.log('Succesful connection to database');
}catch(error){
  console.log(error);
}

//Habilitate Pug
app.set('view engine', 'pug');
app.set('views', './views');

//Public Folder
app.use(express.static('public'));

//Routing
app.use('/auth', userRoutes);

//Define a port and start the project
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});
