const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    // "Bearer blabla"
    jwt.verify(
      token,
      'kobe_bryant_is_the_greatest_basketball_player_of_all_time',
    );
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed!',
    });
  }
};
