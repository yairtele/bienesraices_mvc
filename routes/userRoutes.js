import express from "express";

const router = express.Router();

//Routing
router.get('/', function(req, res){
  res.send('Hola mundo en Express');
});

router.post('/', function(req, res){
  res.json({msg: 'Respuesta de tipo post'});
});

router.get('/nosotros', function(req, res){
  res.send('Información sobre la empresa');
});

export default router;
