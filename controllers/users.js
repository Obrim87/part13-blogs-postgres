const router = require('express').Router();
// require('express-async-errors');

const { User, Blog } = require('../models/index');

router.get('/', async (req, res) => {
  const user = await User.findAll({
    // below is only possible due to joining in models/index.js
    include: {
      model: Blog,
      // as: 'readings',
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt']
      },
      through: {
        attributes: ['id', 'read'],
        as: 'readinglist'
      }
    }
  });
  res.json(user);
});

router.get('/:id', async (req, res) => {
  const read = req.query.read ? req.query.read : ['true', 'false'];

  const user = await User.findByPk(req.params.id, {
    // below is only possible due to joining in models/index.js
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Blog,
      // as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: ['id', 'read'],
        as: 'readinglist',
        where: {
          read: read
        }
      }
    }
  });
  console.log(req.query);
  res.json(user);
});

router.post('/', async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    username: req.body.username
  });
  res.json(user);
});

router.put('/:username', async (req, res) => {
  const oldUsername = req.params.username;
  const newUsername = req.body.username;

  const user = await User.update(
    {
      username: newUsername
    },
    {
      where: {
        username: oldUsername
      }
    }
  );
  if (user[0] === 1) {
    res.send({
      success: `Username ${oldUsername} updated to ${newUsername} successfully.`
    });
  } else {
    throw Error(`Username ${oldUsername} does not exist.`);
  }
});

module.exports = router;

// upto 13.22
