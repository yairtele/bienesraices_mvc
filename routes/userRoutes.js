import express from 'express';
import {loginForm, registerForm, register, forgotPasswordForm} from '../controllers/userController.js'

const router = express.Router();

//Routing
router.get('/login', loginForm);

router.get('/register', registerForm);
router.post('/register', register);

router.get('/forgot-password', forgotPasswordForm);

export default router;
