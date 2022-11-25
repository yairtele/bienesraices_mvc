import express from 'express';

const router = express.Router();

//Routing
router.get('/login', function(req, res){
  res.render('auth/login.pug')//send('Hola mundo en Express');
});

router.get('/nosotros', function(req, res){
  res.send('Información sobre la empresa');
});

export default router;
