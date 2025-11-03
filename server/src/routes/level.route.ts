import express from 'express';
import moduleController from '../controllers/module.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/levels/{id}:
 *   get:
 *     tags:
 *       - Levels
 *     summary: Get level by ID
 *     description: Returns a specific level by its ID
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Level ID
 *     responses:
 *       200:
 *         description: Level data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LevelDTO'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Level not found
 */
router.get('/:id', authMiddleware, moduleController.getLevelById);

/**
 * @openapi
 * /api/levels:
 *   post:
 *     tags:
 *       - Levels
 *       - Admin
 *     summary: Create a new level (Admin only)
 *     description: Creates a new level in a module. Requires admin privileges.
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLevelInput'
 *     responses:
 *       201:
 *         description: Level created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LevelDTO'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Module not found
 */
router.post('/', authMiddleware, adminMiddleware, moduleController.createLevel);

/**
 * @openapi
 * /api/levels/{id}:
 *   put:
 *     tags:
 *       - Levels
 *       - Admin
 *     summary: Update a level (Admin only)
 *     description: Updates an existing level. Requires admin privileges.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Level ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLevelInput'
 *     responses:
 *       200:
 *         description: Level updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LevelDTO'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Level not found
 *   delete:
 *     tags:
 *       - Levels
 *       - Admin
 *     summary: Delete a level (Admin only)
 *     description: Deletes a level and all its quests. Requires admin privileges.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Level ID
 *     responses:
 *       204:
 *         description: Level deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Level not found
 */
router.put('/:id', authMiddleware, adminMiddleware, moduleController.updateLevel);
router.delete('/:id', authMiddleware, adminMiddleware, moduleController.deleteLevel);

export default router;
