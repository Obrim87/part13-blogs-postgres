const { ReadingLists } = require('../models/index');
const { verifyToken, verifyUser } = require('../utils/middleware');
require('express-async-errors');
const router = require('express').Router();

router.post('/', async (req, res) => {
  const addToList = await ReadingLists.create({
    userId: req.body.userId,
    blogId: req.body.blogId
  });

  res.json(addToList);
});

router.put('/:id', verifyToken, verifyUser, async (req, res) => {
  // note that findAll() return an array of objects!
  const readingList = await ReadingLists.findAll({
    where: {
      blogId: req.params.id
    }
  });

  if (readingList.length !== 0) {
    readingList.forEach(async (item) => {
      if (item.userId === req.decodedToken.id) {
        item.read = req.body.read;
        console.log('blog marked as read');
      }
      await item.save();
    });
  } else {
    throw new Error('cannot find a reading list containing that blog');
  }

  res.json(readingList);
});

module.exports = router;
