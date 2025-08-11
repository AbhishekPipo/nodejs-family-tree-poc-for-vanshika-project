const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Person = require('./Person');

const IndirectRelation = sequelize.define('IndirectRelation', {
  personId: {
    type: DataTypes.INTEGER,
    references: {
      model: Person,
      key: 'id',
    },
  },
  relatedToId: {
    type: DataTypes.INTEGER,
    references: {
      model: Person,
      key: 'id',
    },
  },
  relation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Person.hasMany(IndirectRelation, { as: 'indirectRelations', foreignKey: 'personId' });
IndirectRelation.belongsTo(Person, { as: 'person', foreignKey: 'personId' });
IndirectRelation.belongsTo(Person, { as: 'relatedTo', foreignKey: 'relatedToId' });

module.exports = IndirectRelation;
