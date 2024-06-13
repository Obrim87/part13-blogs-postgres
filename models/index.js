const User = require('./user');
const Blog = require('./blog');
const ReadingLists = require('./readingList');
const ActiveSessions = require('./activeSession');

// creates a one-to-many relationship
// allows you to combine these in queries in routes
// User.hasMany(Blog);
// Blog.belongsTo(User);

User.hasMany(ActiveSessions);
ActiveSessions.belongsTo(User);

// creates a many-to-many relationship using the reading_list connection table
User.belongsToMany(Blog, { through: ReadingLists });
Blog.belongsToMany(User, { through: ReadingLists });

// Adding the below to the above Many-to-Many makes this a Super Many-to-Many relationship!
User.hasMany(ReadingLists);
ReadingLists.belongsTo(User);
Blog.hasMany(ReadingLists);
ReadingLists.belongsTo(Blog);

// will create a table using the model if one doesn't exist
// alter will ensure the tables update when modifying the models
// below not used when using migrations
//Blog.sync({ alter: true });
//User.sync({ alter: true });

module.exports = {
  Blog,
  User,
  ReadingLists,
  ActiveSessions
};
