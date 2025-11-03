/**
 * @openapi
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - code
 *         - type
 *         - message
 *       properties:
 *         code:
 *           type: integer
 *           description: HTTP status code
 *           example: 404
 *         type:
 *           type: string
 *           description: Error type identifier
 *           example: QUEST_NOT_FOUND
 *         message:
 *           type: string
 *           description: Human-readable error message
 *           example: Quest not found.
 *   
 *   responses:
 *     BadRequest:
 *       description: Bad request - Invalid input data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             code: 400
 *             type: BAD_REQUEST
 *             message: Bad request.
 *     
 *     Unauthorized:
 *       description: Unauthorized - Invalid or missing authentication token
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             code: 401
 *             type: UNAUTHORIZED
 *             message: Unauthorized.
 *     
 *     Forbidden:
 *       description: Forbidden - Insufficient permissions
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             code: 403
 *             type: ADMIN_REQUIRED
 *             message: Admin access required.
 *     
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             code: 404
 *             type: NOT_FOUND
 *             message: Not found.
 *     
 *     LanguageNotFound:
 *       description: Language not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             code: 404
 *             type: LANGUAGE_NOT_FOUND
 *             message: Language not found.
 *     
 *     ModuleNotFound:
 *       description: Module not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             code: 404
 *             type: MODULE_NOT_FOUND
 *             message: Module not found.
 *     
 *     LevelNotFound:
 *       description: Level not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             code: 404
 *             type: LEVEL_NOT_FOUND
 *             message: Level not found.
 *     
 *     QuestNotFound:
 *       description: Quest not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             code: 404
 *             type: QUEST_NOT_FOUND
 *             message: Quest not found.
 *     
 *     UserNotFound:
 *       description: User not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             code: 404
 *             type: USER_NOT_FOUND
 *             message: User not found.
 *     
 *     InvalidAnswer:
 *       description: Invalid answer format
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             code: 400
 *             type: INVALID_ANSWER
 *             message: Invalid answer format.
 *     
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             code: 500
 *             type: INTERNAL_SERVER_ERROR
 *             message: Internal server error.
 * 
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization
 *   - name: Languages
 *     description: Language management and selection
 *   - name: Modules
 *     description: Learning modules management
 *   - name: Levels
 *     description: Level management within modules
 *   - name: Quests
 *     description: Quest (task) management and submission
 *   - name: Progress
 *     description: User progress tracking and statistics
 *   - name: Admin
 *     description: Administrative operations (requires admin role)
 */
export {};
