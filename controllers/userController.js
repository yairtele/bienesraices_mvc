import {check, validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {generateJWT, generateId} from '../helpers/tokens.js';
import { registryEmail, forgotPasswordEmail } from '../helpers/emails.js';
import User from '../models/User.js';

const loginForm = (req, res) => {
  res.render('auth/login', {
    page: "Login",
    csrfToken: req.csrfToken()
  })
};

const authenticate = async (req, res) => {
  //Validation
  await check('email').isEmail().withMessage('Email is not correct').run(req);
  await check('password').notEmpty().withMessage('Please enter your password').run(req);

  let result = validationResult(req);

  //Verify result is empty
  if(!result.isEmpty()){ //if there are errors
    return res.render('auth/login', {
      page: 'Login',
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        email: req.body.email
      }
    })
  }

  const {email, password} = req.body;
  //Verify if user exists
  const user = await User.findOne({where: {email}});

  if(!user){
    return res.render('auth/login', {
      page: 'Login',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'User does not exist'}],
      user: {
        email: req.body.email
      }
    });
  }

  //Verify if user is confirmed
  if(!user.confirmed){
    return res.render('auth/login', {
      page: 'Login',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'Your account has not been confirmed yet'}],
      user: {
        email: req.body.email
      }
    });
  }

  //Verify password
  if(!user.verifyPassword(password)){
    return res.render('auth/login', {
      page: 'Login',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'Incorrect password'}],
      user: {
        email: req.body.email
      }
    });
  }

  //Authenticate user
  const token = generateJWT({id: user.id, name: user.firstName});

  //Save in cookie
  return res.cookie('_token', token, {
    httpOnly: true,//avoid cross site attacks
    secure:true //cookies in secure connections
  }).redirect('/my_properties');
}

const registerForm = (req, res) => {

  res.render('auth/register', {
    page: 'Create account',
    csrfToken: req.csrfToken()
  })
};
//
const register = async (req,res) => {

  //Validation
  await check('firstName').notEmpty().withMessage('First name cannot be empty').run(req);
  await check('lastName').notEmpty().withMessage('Last name cannot be empty').run(req);

  await check('email').isEmail().withMessage('Email is not correct').run(req);

  await check('password').isLength({min: 6}).withMessage('Password length must be at least 6 characters').run(req);
  await check('repeatedPassword').equals(req.body.password).withMessage('Passwords are not equals!').run(req);

  let result = validationResult(req);

  //Verify result is empty
  if(!result.isEmpty()){ //if there are errors
    return res.render('auth/register', {
      page: 'Create account',
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      }
    })
  }

  //Extract data
  const {firstName, lastName, email, password} = req.body;

  //Verify not duplicated user
  const userExists = await User.findOne({where: {email}});

  console.log(userExists);

  if(userExists){
    return res.render('auth/register', {
      page: 'Create account',
      csrfToken: req.csrfToken(),
      errors: [{msg: 'User already exists'}],
      user: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      }
    })
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    token: generateId()
  })

  //Send confirmation email
  registryEmail({
    firstName: user.firstName,
    email: user.email,
    token: user.token
  })

  //Show confirmation message
  res.render('templates/message', {
    page: 'Account created',
    message: 'We have sent a confirmation email, please click the link'
  })

}

const confirm = async (req, res) => {

  const {token} = req.params;
    
  //Verify if token is valid
  const user = await User.findOne({where: {token}})

  if(!user){
    res.render('auth/confirm-account', {
      page: 'Error confirming your account',
      message: 'There was an error when confirming your account, please try again',
      error: true
    })
  }

  //Confirm account
  user.token = null;
  user.confirmed = true;

  await user.save();

  res.render('auth/confirm-account', {
    page: 'Account confirmed',
    message: 'Your account was confirmed correctly'
  })

}

const forgotPasswordForm = (req, res) => {
  res.render('auth/forgot-password', {
    page: 'Retrieve your access',
    csrfToken: req.csrfToken()
  })
};

const resetPassword = async (req, res) => {

  //Validation
  await check('email').isEmail().withMessage('Email is not correct').run(req);

  let result = validationResult(req);

  //Verify result is empty
  if(!result.isEmpty()){ //if there are errors
    return res.render('auth/forgot-password', {
      page: 'Retrieve your access',
      csrfToken: req.csrfToken(),
      errors: result.array(),
    })
  }

  //Search user
  const {email} = req.body;

  const user = await User.findOne({where: {email}});

  if(!user){
    return res.render('auth/forgot-password', {
      page: 'Retrieve your access',
      csrfToken: req.csrfToken(),
      errors: [{msg: "The email doesn't belong to any user"}],
    })
  }

  //Generate token and send email
  user.token = generateId();
  await user.save();

  //Send email
  forgotPasswordEmail({
    email: user.email,
    firstName: user.firstName,
    token: user.token
  })

  //Render message
  res.render('templates/message', {
    page: 'Reset your password',
    message: 'We have sent you an email with instructions'
  })
}

const verifyToken = async (req, res) => {

  const {token} = req.params;

  const user = await User.findOne({where: {token}});

  if(!user){
    res.render('auth/confirm-account', {
      page: 'Reset your password',
      message: 'There was an error when validating the information, please try again',
      error: true
    })
  }

  //Show form to reset password
  res.render('auth/reset-password', {
    page: 'Reset your password',
    csrfToken: req.csrfToken()
  })

}

const newPassword = async (req, res) => {

  //Validate password
  await check('password').isLength({min: 6}).withMessage('Password length must be at least 6 characters').run(req);

  let result = validationResult(req);

  //Verify result is empty
  if(!result.isEmpty()){ //if there are errors
    return res.render('auth/reset-password', {
      page: 'Reset your password',
      csrfToken: req.csrfToken(),
      errors: result.array()
    })
  }

  const {token} = req.params;
  const {password} = req.body;

  //Check who is updating pass
  const user = await User.findOne({where: {token}});

  //Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  //Disable token and save changes
  user.token = null;
  await user.save();

  res.render('auth/confirm-account', {
    page: 'Password was reseted',
    message: 'New password was saved correctly'
  })
}

export {
  loginForm,
  authenticate,
  registerForm,
  register,
  confirm,
  forgotPasswordForm,
  resetPassword,
  verifyToken,
  newPassword
}
