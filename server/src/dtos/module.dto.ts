/**
 * @openapi
 * components:
 *   schemas:
 *     ModuleDTO:
 *       type: object
 *       required:
 *         - id
 *         - languageId
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Module ID
 *           example: 1
 *         languageId:
 *           type: integer
 *           description: Language ID this module belongs to
 *           example: 1
 *         name:
 *           type: string
 *           description: Module name
 *           example: Beginner
 *         icon:
 *           type: string
 *           description: Module icon (emoji or URL)
 *           example: 📚
 *     
 *     LevelDTO:
 *       type: object
 *       required:
 *         - id
 *         - moduleId
 *         - name
 *         - questsCount
 *       properties:
 *         id:
 *           type: integer
 *           description: Level ID
 *           example: 1
 *         moduleId:
 *           type: integer
 *           description: Module ID this level belongs to
 *           example: 1
 *         name:
 *           type: string
 *           description: Level name
 *           example: Greetings
 *         questsCount:
 *           type: integer
 *           description: Number of quests in this level
 *           example: 10
 *     
 *     LevelProgressDTO:
 *       type: object
 *       required:
 *         - questsCompleted
 *         - score
 *         - stars
 *       properties:
 *         questsCompleted:
 *           type: integer
 *           description: Number of quests completed by user
 *           example: 5
 *         score:
 *           type: integer
 *           description: Number of correct answers
 *           example: 4
 *         stars:
 *           type: integer
 *           description: Stars earned (equal to score)
 *           example: 4
 *     
 *     LevelWithProgressDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/LevelDTO'
 *         - type: object
 *           properties:
 *             userProgress:
 *               $ref: '#/components/schemas/LevelProgressDTO'
 *     
 *     ModuleWithLevelsDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/ModuleDTO'
 *         - type: object
 *           required:
 *             - levels
 *           properties:
 *             levels:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LevelWithProgressDTO'
 *     
 *     CreateModuleInput:
 *       type: object
 *       required:
 *         - languageId
 *         - name
 *       properties:
 *         languageId:
 *           type: integer
 *           description: Language ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Module name
 *           example: Intermediate
 *         icon:
 *           type: string
 *           description: Module icon (emoji or URL)
 *           example: 📖
 *     
 *     UpdateModuleInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Module name
 *           example: Advanced
 *         icon:
 *           type: string
 *           description: Module icon (emoji or URL)
 *           example: 🎓
 *     
 *     CreateLevelInput:
 *       type: object
 *       required:
 *         - moduleId
 *         - name
 *         - questsCount
 *       properties:
 *         moduleId:
 *           type: integer
 *           description: Module ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Level name
 *           example: Food and Drinks
 *         questsCount:
 *           type: integer
 *           description: Number of quests in this level
 *           example: 20
 *     
 *     UpdateLevelInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Level name
 *           example: Animals
 *         questsCount:
 *           type: integer
 *           description: Number of quests in this level
 *           example: 15
 */

export interface ModuleDTO {
  id: number;
  languageId: number;
  name: string;
  icon?: string | null;
}

export interface LevelDTO {
  id: number;
  moduleId: number;
  name: string;
  questsCount: number;
}

export interface LevelProgressDTO {
  questsCompleted: number;
  score: number;
  stars: number;
}

export interface LevelWithProgressDTO extends LevelDTO {
  userProgress?: LevelProgressDTO;
}

export interface ModuleWithLevelsDTO extends ModuleDTO {
  levels: LevelWithProgressDTO[];
}

export interface CreateModuleInput {
  languageId: number;
  name: string;
  icon?: string;
}

export interface UpdateModuleInput {
  name?: string;
  icon?: string;
}

export interface CreateLevelInput {
  moduleId: number;
  name: string;
  questsCount: number;
}

export interface UpdateLevelInput {
  name?: string;
  questsCount?: number;
}
