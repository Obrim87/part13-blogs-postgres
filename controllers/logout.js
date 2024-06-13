require('express-async-errors');
const router = require('express').Router();
const { ActiveSessions } = require('../models/index');
const { verifyToken, verifyUser } = require('../utils/middleware');

router.delete('/', verifyToken, verifyUser, async (req, res) => {
  await ActiveSessions.destroy({
    where: {
      userId: req.decodedToken.id
    }
  });

  res.json({ msg: 'Logged out successfully' });
});

module.exports = router;
