const loginForm = (req, res) => {
  res.render('auth/login.pug', {
    authenticated: false
  })
};

const registerForm = (req, res) => {
  res.render('auth/register.pug', {
    page: 'Create account'
  })
};

export {
  loginForm,
  registerForm
}
