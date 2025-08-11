const express = require('express');
const { getFamilyTree } = require('../controllers/familyController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/family-tree:
 *   get:
 *     summary: Get the family tree for the logged-in user
 *     tags: [Family]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The family tree
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Logged in user not found
 */
router.get('/family-tree', authMiddleware, getFamilyTree);

module.exports = router;
