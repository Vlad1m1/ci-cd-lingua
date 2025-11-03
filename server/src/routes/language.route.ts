import express from 'express';
import languageController from '../controllers/language.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/languages:
 *   get:
 *     tags:
 *       - Languages
 *     summary: Get all languages
 *     description: Returns a list of all available languages for learning
 *     responses:
 *       200:
 *         description: List of languages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LanguageDTO'
 */
router.get('/', languageController.getAllLanguages);

/**
 * @openapi
 * /api/languages/{id}:
 *   get:
 *     tags:
 *       - Languages
 *     summary: Get language by ID
 *     description: Returns a specific language by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Language data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LanguageDTO'
 *       404:
 *         description: Language not found
 */
router.get('/:id', languageController.getLanguageById);

/**
 * @openapi
 * /api/languages/user/set:
 *   put:
 *     tags:
 *       - Languages
 *     summary: Set user's learning language
 *     description: Sets the language that the user wants to learn
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetUserLanguageInput'
 *     responses:
 *       200:
 *         description: Language set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Language set successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Language not found
 */
router.put('/user/set', authMiddleware, languageController.setUserLanguage);

/**
 * @openapi
 * /api/languages/user/current:
 *   get:
 *     tags:
 *       - Languages
 *     summary: Get user's current learning language
 *     description: Returns the language currently selected by the user for learning
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Current user language
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LanguageDTO'
 *       401:
 *         description: Unauthorized
 */
router.get('/user/current', authMiddleware, languageController.getUserLanguage);

/**
 * @openapi
 * /api/languages:
 *   post:
 *     tags:
 *       - Languages
 *       - Admin
 *     summary: Create a new language (Admin only)
 *     description: Creates a new language for learning. Requires admin privileges.
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLanguageInput'
 *     responses:
 *       201:
 *         description: Language created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LanguageDTO'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/', authMiddleware, adminMiddleware, languageController.createLanguage);

/**
 * @openapi
 * /api/languages/{id}:
 *   put:
 *     tags:
 *       - Languages
 *       - Admin
 *     summary: Update a language (Admin only)
 *     description: Updates an existing language. Requires admin privileges.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Language ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLanguageInput'
 *     responses:
 *       200:
 *         description: Language updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LanguageDTO'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Language not found
 *   delete:
 *     tags:
 *       - Languages
 *       - Admin
 *     summary: Delete a language (Admin only)
 *     description: Deletes a language. Requires admin privileges.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Language ID
 *     responses:
 *       204:
 *         description: Language deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Language not found
 */
router.put('/:id', authMiddleware, adminMiddleware, languageController.updateLanguage);
router.delete('/:id', authMiddleware, adminMiddleware, languageController.deleteLanguage);

export default router;
