const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Person = require('./Person');

const DirectRelation = sequelize.define('DirectRelation', {
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

Person.hasMany(DirectRelation, { as: 'directRelations', foreignKey: 'personId' });
DirectRelation.belongsTo(Person, { as: 'person', foreignKey: 'personId' });
DirectRelation.belongsTo(Person, { as: 'relatedTo', foreignKey: 'relatedToId' });


module.exports = DirectRelation;
