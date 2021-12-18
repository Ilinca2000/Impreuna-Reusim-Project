const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Feedback = sequelize.define('feedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  feedbackStatus: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ['SMILEY', 'FROWNY', 'SURPRISED', 'CONFUSED'],
  },
});

module.exports = Feedback;
