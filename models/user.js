const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Validation isEmail on username failed'
        }
      }
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user'
  }
);

module.exports = User;
