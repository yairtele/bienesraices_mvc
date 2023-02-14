import {check, validationResult} from 'express-validator'
import {generateId} from '../helpers/tokens.js'
import { registryEmail } from '../helpers/emails.js';
import User from '../models/User.js';

const loginForm = (req, res) => {
  res.render('auth/login', {
    page: "Login"
  })
};

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

  await check('email').isEmail().withMessage('This looks not like an email!').run(req);

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
    page: 'Retrieve your access'
  })
};

export {
  loginForm,
  registerForm,
  register,
  confirm,
  forgotPasswordForm
}
