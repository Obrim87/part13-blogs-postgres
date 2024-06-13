const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('reading_lists', 'read', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.removeColumn('blogs', 'read');
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('reading_lists', 'read');
    await queryInterface.addColumn('blogs', 'read');
  }
};
