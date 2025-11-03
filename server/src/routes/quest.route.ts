import express from 'express';
import questController from '../controllers/quest.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/quests/level/{levelId}:
 *   get:
 *     tags:
 *       - Quests
 *     summary: Get quests by level
 *     description: Returns all quests for a specific level
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
 *         description: List of quests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuestDTO'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Level not found
 */
router.get('/level/:levelId', authMiddleware, questController.getQuestsByLevel);

/**
 * @openapi
 * /api/quests/{id}:
 *   get:
 *     tags:
 *       - Quests
 *     summary: Get quest by ID
 *     description: Returns a specific quest by its ID with all data
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quest ID
 *     responses:
 *       200:
 *         description: Quest data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestDTO'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quest not found
 */
router.get('/:id', authMiddleware, questController.getQuestById);

/**
 * @openapi
 * /api/quests/submit:
 *   post:
 *     tags:
 *       - Quests
 *     summary: Submit answer to a quest
 *     description: Submits user's answer and checks if it's correct
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmitAnswerInput'
 *     responses:
 *       200:
 *         description: Answer checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestResultDTO'
 *       400:
 *         description: Invalid answer format
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quest not found
 */
router.post('/submit', authMiddleware, questController.submitAnswer);

/**
 * @openapi
 * /api/quests:
 *   post:
 *     tags:
 *       - Quests
 *       - Admin
 *     summary: Create a new quest (Admin only)
 *     description: |
 *       Creates a new quest of any type. Requires admin privileges.
 *       
 *       For dictation and translate quests, audio files are automatically generated using TTS and saved to /media folder.
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/CreateQuestMatchWordsInput'
 *               - $ref: '#/components/schemas/CreateQuestDictationInput'
 *               - $ref: '#/components/schemas/CreateQuestTranslateInput'
 *           examples:
 *             match_words:
 *               summary: Match Words Quest
 *               value:
 *                 type: match_words
 *                 levelId: 1
 *                 word: apple
 *                 translate: яблоко
 *             dictation:
 *               summary: Dictation Quest
 *               value:
 *                 type: dictation
 *                 levelId: 1
 *                 text: I like apples
 *                 language: en
 *                 distractorWords: [oranges, bananas, grapes]
 *             translate:
 *               summary: Translate Quest
 *               value:
 *                 type: translate
 *                 levelId: 1
 *                 sourceSentence: Я люблю яблоки
 *                 correctSentence: I like apples
 *                 targetLanguage: en
 *                 distractorWords: [oranges, bananas]
 *     responses:
 *       201:
 *         description: Quest created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuestDTO'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Level not found
 */
router.post('/', authMiddleware, adminMiddleware, questController.createQuest);

/**
 * @openapi
 * /api/quests/{id}:
 *   delete:
 *     tags:
 *       - Quests
 *       - Admin
 *     summary: Delete a quest (Admin only)
 *     description: Deletes a quest and all related data. Requires admin privileges.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Quest ID
 *     responses:
 *       204:
 *         description: Quest deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Quest not found
 */
router.delete('/:id', authMiddleware, adminMiddleware, questController.deleteQuest);

export default router;
