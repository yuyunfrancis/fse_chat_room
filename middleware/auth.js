const isLogin = async (req, res, next) => {
  try {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect('/');
    } else {
      next();
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { isLogin, isLogout };
