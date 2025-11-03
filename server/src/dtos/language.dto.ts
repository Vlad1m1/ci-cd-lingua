/**
 * @openapi
 * components:
 *   schemas:
 *     LanguageDTO:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Language ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Language name
 *           example: English
 *         icon:
 *           type: string
 *           description: Language icon (emoji or URL)
 *           example: 🇬🇧
 *     
 *     CreateLanguageInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Language name
 *           example: German
 *         icon:
 *           type: string
 *           description: Language icon (emoji or URL)
 *           example: 🇩🇪
 *     
 *     UpdateLanguageInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Language name
 *           example: Spanish
 *         icon:
 *           type: string
 *           description: Language icon (emoji or URL)
 *           example: 🇪🇸
 *     
 *     SetUserLanguageInput:
 *       type: object
 *       required:
 *         - languageId
 *       properties:
 *         languageId:
 *           type: integer
 *           description: Language ID to set for user
 *           example: 1
 */

export interface LanguageDTO {
  id: number;
  name: string;
  icon?: string | null;
}

export interface CreateLanguageInput {
  name: string;
  icon?: string;
}

export interface UpdateLanguageInput {
  name?: string;
  icon?: string;
}

export interface SetUserLanguageInput {
  languageId: number;
}
