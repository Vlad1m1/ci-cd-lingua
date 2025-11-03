import express from 'express';
import progressController from '../controllers/progress.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/progress/save:
 *   post:
 *     tags:
 *       - Progress
 *     summary: Save user progress
 *     description: |
 *       Saves progress after completing a quest. Updates user's level progress and overall statistics.
 *       
 *       Stars are equal to the score (number of correct answers).
 *       Experience is calculated as score / 100.
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveProgressInput'
 *     responses:
 *       200:
 *         description: Progress saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLevelProgressDTO'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Level or user not found
 */
router.post('/save', authMiddleware, progressController.saveProgress);

/**
 * @openapi
 * /api/progress/stats:
 *   get:
 *     tags:
 *       - Progress
 *     summary: Get user statistics
 *     description: |
 *       Returns comprehensive user statistics including total stars, experience, 
 *       completed levels count, and current level progress.
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStatsDTO'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/stats', authMiddleware, progressController.getUserStats);

/**
 * @openapi
 * /api/progress/level/{levelId}:
 *   get:
 *     tags:
 *       - Progress
 *     summary: Get progress for a specific level
 *     description: Returns user's progress on a specific level
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: levelId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Level ID
 *     responses:
 *       200:
 *         description: Level progress data (null if not started)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/UserLevelProgressDTO'
 *                 - type: 'null'
 *       401:
 *         description: Unauthorized
 */
router.get('/level/:levelId', authMiddleware, progressController.getLevelProgress);

export default router;
