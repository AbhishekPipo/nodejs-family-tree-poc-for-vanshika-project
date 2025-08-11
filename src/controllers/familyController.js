const Person = require('../models/Person');
const DirectRelation = require('../models/DirectRelation');
const IndirectRelation = require('../models/IndirectRelation');
const { Op } = require('sequelize');

const getRelationshipLabel = (loggedInUser, person, allPeople) => {
    if (loggedInUser.id === person.id) return 'self';

    
    const directRelation = loggedInUser.directRelations.find(r => r.relatedToId === person.id);
    if (directRelation) {
        return directRelation.relation;
    }

    const indirectRelation = loggedInUser.indirectRelations.find(r => r.relatedToId === person.id);
    if (indirectRelation) {
        const loggedInUserDob = new Date(loggedInUser.dob);
        const personDob = new Date(person.dob);

        if (person.gender === 'Male') {
            if (personDob < loggedInUserDob) {
                // Could be father or grandfather
                const isFather = loggedInUser.indirectRelations.some(r => r.relatedToId === person.id && r.relation === 'father');
                if (isFather) return 'father';

                // Check if this person is a father of the logged-in user's parent
                const parent = allPeople.find(p => loggedInUser.indirectRelations.some(r => r.relatedToId === p.id && (r.relation === 'father' || r.relation === 'mother')));
                if(parent && parent.indirectRelations.some(r => r.relatedToId === person.id && r.relation === 'father')) {
                    return 'grandfather';
                }
                return 'uncle'; // fallback
            } else {
                 return 'brother';
            }
        } else { // Female
             if (personDob < loggedInUserDob) {
                const isMother = loggedInUser.indirectRelations.some(r => r.relatedToId === person.id && r.relation === 'mother');
                if (isMother) return 'mother';

                const parent = allPeople.find(p => loggedInUser.indirectRelations.some(r => r.relatedToId === p.id && (r.relation === 'father' || r.relation === 'mother')));
                 if(parent && parent.indirectRelations.some(r => r.relatedToId === person.id && r.relation === 'mother')) {
                    return 'grandmother';
                }
                return 'aunty'; // fallback
            } else {
                return 'sister';
            }
        }
    }


    // Fallback for more distant relations if needed
    return 'relation';
};


exports.getFamilyTree = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;

        const loggedInUser = await Person.findOne({
            where: { id: loggedInUserId },
            include: [
                { model: DirectRelation, as: 'directRelations' },
                { model: IndirectRelation, as: 'indirectRelations' },
            ]
        });

        if (!loggedInUser) {
            return res.status(404).json({ error: 'Logged in user not found as a person in the tree' });
        }

        const directRelations = await DirectRelation.findAll({
            where: { personId: loggedInUserId },
            include: [
                { 
                    model: Person,
                    as: 'relatedTo',
                    attributes: ['name']
                }
            ]
        });

        const indirectRelations = await IndirectRelation.findAll({
            where: { personId: loggedInUserId }
        });

        const adjacent = directRelations.map(r => r.relatedToId);

        const ancestors = [];
        const descendants = [];

        const loggedInUserDob = new Date(loggedInUser.dob);

        for (const relation of indirectRelations) {
            const relatedPerson = await Person.findByPk(relation.relatedToId);
            if (relatedPerson) {
                const relatedPersonDob = new Date(relatedPerson.dob);
                if (relatedPersonDob < loggedInUserDob) {
                    ancestors.push(relation.relatedToId);
                } else {
                    descendants.push(relation.relatedToId);
                }
            }
        }

        const allIds = [...new Set([loggedInUserId, ...adjacent, ...ancestors, ...descendants])];

        const allPeopleRaw = await Person.findAll({
            where: {
                id: {
                    [Op.in]: allIds
                }
            },
            include: [
                { 
                    model: DirectRelation, 
                    as: 'directRelations',
                    include: [
                        {
                            model: Person,
                            as: 'relatedTo',
                            attributes: ['name']
                        }
                    ]
                },
                { model: IndirectRelation, as: 'indirectRelations' },
            ]
        });

        const allPeople = allPeopleRaw.map(p => p.get({ plain: true }));

        const familyTree = allPeople.map(person => {
            return {
                ...person,
                relationship: getRelationshipLabel(loggedInUser, person, allPeople)
            };
        });

        res.json({
            ancestors: familyTree.filter(p => ancestors.includes(p.id)),
            descendants: familyTree.filter(p => descendants.includes(p.id)),
            adjacent: familyTree.filter(p => adjacent.includes(p.id)),
            self: familyTree.find(p => p.id === loggedInUserId)
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
