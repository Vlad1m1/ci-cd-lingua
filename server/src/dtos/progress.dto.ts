/**
 * @openapi
 * components:
 *   schemas:
 *     UserLevelProgressDTO:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - levelId
 *         - questsCount
 *         - score
 *         - stars
 *         - exp
 *       properties:
 *         id:
 *           type: integer
 *           description: User level progress ID
 *           example: 1
 *         userId:
 *           type: integer
 *           description: User ID
 *           example: 1
 *         levelId:
 *           type: integer
 *           description: Level ID
 *           example: 1
 *         questsCount:
 *           type: integer
 *           description: Number of quests completed
 *           example: 5
 *         score:
 *           type: integer
 *           description: Number of correct answers
 *           example: 4
 *         stars:
 *           type: integer
 *           description: Stars earned (equal to score)
 *           example: 4
 *         exp:
 *           type: integer
 *           description: Experience earned (score / 100)
 *           example: 0
 *     
 *     CurrentLevelDTO:
 *       type: object
 *       required:
 *         - levelId
 *         - levelName
 *         - progress
 *         - questsCompleted
 *         - totalQuests
 *       properties:
 *         levelId:
 *           type: integer
 *           description: Current level ID
 *           example: 2
 *         levelName:
 *           type: string
 *           description: Current level name
 *           example: Numbers
 *         progress:
 *           type: number
 *           description: Progress percentage (0-100)
 *           example: 33.33
 *         questsCompleted:
 *           type: integer
 *           description: Number of quests completed
 *           example: 5
 *         totalQuests:
 *           type: integer
 *           description: Total number of quests in level
 *           example: 15
 *     
 *     UserStatsDTO:
 *       type: object
 *       required:
 *         - totalStars
 *         - totalExp
 *         - completedLevels
 *       properties:
 *         totalStars:
 *           type: integer
 *           description: Total stars earned across all levels
 *           example: 15
 *         totalExp:
 *           type: integer
 *           description: Total experience earned
 *           example: 0
 *         completedLevels:
 *           type: integer
 *           description: Number of completed levels
 *           example: 1
 *         currentLevel:
 *           $ref: '#/components/schemas/CurrentLevelDTO'
 *     
 *     SaveProgressInput:
 *       type: object
 *       required:
 *         - levelId
 *         - questId
 *         - correct
 *       properties:
 *         levelId:
 *           type: integer
 *           description: Level ID
 *           example: 1
 *         questId:
 *           type: integer
 *           description: Quest ID
 *           example: 1
 *         correct:
 *           type: boolean
 *           description: Whether the answer was correct
 *           example: true
 */

export interface UserLevelProgressDTO {
  id: number;
  userId: number;
  levelId: number;
  questsCount: number;
  score: number;
  stars: number;
  exp: number;
}

export interface CurrentLevelDTO {
  levelId: number;
  levelName: string;
  progress: number;
  questsCompleted: number;
  totalQuests: number;
}

export interface UserStatsDTO {
  totalStars: number;
  totalExp: number;
  completedLevels: number;
  currentLevel?: CurrentLevelDTO;
}

export interface SaveProgressInput {
  levelId: number;
  questId: number;
  correct: boolean;
}
