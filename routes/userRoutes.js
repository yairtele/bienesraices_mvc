import express from 'express';
import {loginForm, registerForm, forgotPasswordForm} from '../controllers/userController.js'

const router = express.Router();

//Routing
router.get('/login', loginForm);
router.get('/register', registerForm);
router.get('/forgot-password', forgotPasswordForm);

export default router;
