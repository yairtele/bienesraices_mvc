const loginForm = (req, res) => {
  res.render('auth/login.pug', {
    page: "Login"
  })
};

const registerForm = (req, res) => {
  res.render('auth/register.pug', {
    page: 'Create account'
  })
};

const forgotPasswordForm = (req, res) => {
  res.render('auth/forgot-password.pug', {
    page: 'Retrieve your access'
  })
};

export {
  loginForm,
  registerForm,
  forgotPasswordForm
}
