require('express-async-errors');
const router = require('express').Router();
const { Blog, User } = require('../models/index');
const { Op } = require('sequelize');
const { verifyToken, verifyUser } = require('../utils/middleware');

router.get('/', async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } }
      ]
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    where,
    order: [['likes', 'DESC']],
    // below is only possible due to joining in models/index.js
    include: {
      model: User,
      attributes: ['name'],
      through: {
        attributes: ['id', 'user_id', 'blog_id', 'read']
      }
    }
  });
  res.json(blogs);
});

router.get('/:id', async (req, res) => {
  // Pk = primary key
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    console.log(blog.toJSON());
    res.json(blog);
  } else {
    throw Error('Could not find blog with matching ID');
  }
});

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (blog) {
    if (req.body.likes >= 0) {
      blog.likes = req.body.likes;
      await blog.save();
      res.json(blog);
    }
  } else {
    throw Error('Could not find blog with matching ID');
  }
});

router.post('/', verifyToken, verifyUser, async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.decodedToken.id
    }
  });
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.send(blog);
});

router.delete('/:id', verifyToken, verifyUser, async (req, res) => {
  const blog = await Blog.destroy({
    where: {
      id: req.params.id,
      userId: req.decodedToken.id
    }
  });

  if (blog === 1) {
    res.status(200).json({ Success: 'Blog deleted' });
  } else {
    throw Error(
      'Could not find blog with matching ID or you are not authorised to delete this blog'
    );
  }
});

module.exports = router;
