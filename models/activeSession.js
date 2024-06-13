const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class ActiveSessions extends Model {}

ActiveSessions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    modelName: 'active_sessions'
  }
);

module.exports = ActiveSessions;
