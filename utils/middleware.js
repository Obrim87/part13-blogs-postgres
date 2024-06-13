const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const { ActiveSessions, User } = require('../models/index');

const verifyToken = async (req, res, next) => {
  const authorization = req.get('Authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    const sessions = await ActiveSessions.findOne({
      where: {
        token: token
      }
    });

    if (!sessions) {
      throw new Error('Invalid session, please login again');
    }

    req.decodedToken = jwt.verify(token, SECRET);
    next();
  } else {
    throw new Error('Invalid token');
  }
};

const verifyUser = async (req, res, next) => {
  const userId = req.decodedToken.id;

  const user = await User.findOne({
    where: {
      id: userId
    }
  });

  if (user.disabled) {
    await ActiveSessions.destroy({
      where: {
        user_id: userId
      }
    });
    throw new Error(
      'User has been disabled, please contact your administrator'
    );
  }
  next();
};

module.exports = { verifyToken, verifyUser };
