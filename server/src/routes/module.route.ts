import express from 'express';
import moduleController from '../controllers/module.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/modules/{languageId}:
 *   get:
 *     tags:
 *       - Modules
 *     summary: Get modules by language
 *     description: Returns all modules for a specific language with levels and user progress
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: languageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Language ID
 *     responses:
 *       200:
 *         description: List of modules with levels and progress
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ModuleWithLevelsDTO'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Language not found
 */
router.get('/:languageId', authMiddleware, moduleController.getModulesByLanguage);

/**
 * @openapi
 * /api/modules/single/{id}:
 *   get:
 *     tags:
 *       - Modules
 *     summary: Get module by ID
 *     description: Returns a specific module by its ID
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModuleDTO'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Module not found
 */
router.get('/single/:id', authMiddleware, moduleController.getModuleById);

/**
 * @openapi
 * /api/modules:
 *   post:
 *     tags:
 *       - Modules
 *       - Admin
 *     summary: Create a new module (Admin only)
 *     description: Creates a new learning module for a language. Requires admin privileges.
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateModuleInput'
 *     responses:
 *       201:
 *         description: Module created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModuleDTO'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Language not found
 */
router.post('/', authMiddleware, adminMiddleware, moduleController.createModule);

/**
 * @openapi
 * /api/modules/{id}:
 *   put:
 *     tags:
 *       - Modules
 *       - Admin
 *     summary: Update a module (Admin only)
 *     description: Updates an existing module. Requires admin privileges.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateModuleInput'
 *     responses:
 *       200:
 *         description: Module updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModuleDTO'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Module not found
 *   delete:
 *     tags:
 *       - Modules
 *       - Admin
 *     summary: Delete a module (Admin only)
 *     description: Deletes a module and all its levels. Requires admin privileges.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
 *     responses:
 *       204:
 *         description: Module deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Module not found
 */
router.put('/:id', authMiddleware, adminMiddleware, moduleController.updateModule);
router.delete('/:id', authMiddleware, adminMiddleware, moduleController.deleteModule);

export default router;
