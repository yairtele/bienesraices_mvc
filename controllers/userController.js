const loginForm = (req, res) => {
  res.render('auth/login.pug', {
    page: "Login",
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
