const Person = require('../models/Person');
const DirectRelation = require('../models/DirectRelation');
const IndirectRelation = require('../models/IndirectRelation');
const User = require('../models/User');

const seedDatabase = async () => {
  try {
    // Users
    await User.create({ name: 'Prashanth', gender: 'Male', dob: '1985-05-20', email: 'prashanth@example.com', password: 'password' });
    await User.create({ name: 'Simron', gender: 'Female', dob: '2010-10-15', email: 'simron@example.com', password: 'password' });


    // Family members
    const prashanth = await Person.create({ id: 1, name: 'Prashanth', gender: 'Male', dob: '1985-05-20' });
    const anjali = await Person.create({ id: 2, name: 'Anjali', gender: 'Female', dob: '1988-08-25' });
    const ramesh = await Person.create({ id: 3, name: 'Ramesh', gender: 'Male', dob: '1960-01-10' });
    const mallika = await Person.create({ id: 4, name: 'Mallika', gender: 'Female', dob: '1962-03-12' });
    const simron = await Person.create({ id: 5, name: 'Simron', gender: 'Female', dob: '2010-10-15' });
    const anjaliFather = await Person.create({ id: 6, name: 'Anjali-Father', gender: 'Male', dob: '1961-02-20' });
    const anjaliMother = await Person.create({ id: 7, name: 'Anjali-Mother', gender: 'Female', dob: '1963-04-18' });


    // Prashanth's relations
    await DirectRelation.create({ personId: 1, relatedToId: 2, relation: 'wife' });
    await IndirectRelation.create({ personId: 1, relatedToId: 3, relation: 'father' });
    await IndirectRelation.create({ personId: 1, relatedToId: 4, relation: 'mother' });
    await IndirectRelation.create({ personId: 1, relatedToId: 5, relation: 'daughter' });

    // Anjali's relations
    await DirectRelation.create({ personId: 2, relatedToId: 1, relation: 'husband' });
    await IndirectRelation.create({ personId: 2, relatedToId: 5, relation: 'daughter' });
    await IndirectRelation.create({ personId: 2, relatedToId: 6, relation: 'father' });
    await IndirectRelation.create({ personId: 2, relatedToId: 7, relation: 'mother' });


    // Simron's relations
    await IndirectRelation.create({ personId: 5, relatedToId: 1, relation: 'father' });
    await IndirectRelation.create({ personId: 5, relatedToId: 2, relation: 'mother' });
    await IndirectRelation.create({ personId: 5, relatedToId: 3, relation: 'grandfather' });
    await IndirectRelation.create({ personId: 5, relatedToId: 4, relation: 'grandmother' });
     await IndirectRelation.create({ personId: 5, relatedToId: 6, relation: 'grandfather' });
    await IndirectRelation.create({ personId: 5, relatedToId: 7, relation: 'grandmother' });


    // Ramesh's relations
    await DirectRelation.create({ personId: 3, relatedToId: 4, relation: 'wife' });
    await IndirectRelation.create({ personId: 3, relatedToId: 1, relation: 'son' });
    await IndirectRelation.create({ personId: 3, relatedToId: 5, relation: 'granddaughter' });


    // Mallika's relations
    await DirectRelation.create({ personId: 4, relatedToId: 3, relation: 'husband' });
    await IndirectRelation.create({ personId: 4, relatedToId: 1, relation: 'son' });
    await IndirectRelation.create({ personId: 4, relatedToId: 5, relation: 'granddaughter' });


    console.log('Database seeded');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
