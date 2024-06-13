require('express-async-errors');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { User, ActiveSessions } = require('../models/index');
const { SECRET } = require('../utils/config');

router.post('/', async (req, res) => {
  const body = req.body;
  const passwordCorrect = body.password === 'secret';
  const user = await User.findOne({
    where: {
      username: body.username
    }
  });

  if (!user || !passwordCorrect) {
    throw new Error('Username or password incorrect');
  }

  // done outside of middleware as token not added to request yet
  if (user.disabled) {
    await ActiveSessions.destroy({
      where: {
        user_id: user.id
      }
    });
    throw new Error('User disabled, please contact your administrator');
  }

  const userForToken = {
    id: user.id,
    username: user.username
  };

  const token = jwt.sign(userForToken, SECRET);

  const session = await ActiveSessions.create({
    user_id: user.id,
    token: token
  });

  res.json({
    token,
    username: user.username,
    name: user.name,
    session
  });
});

module.exports = router;
