/**
 * @openapi
 * components:
 *   schemas:
 *     QuestMatchWordsDataDTO:
 *       type: object
 *       required:
 *         - word
 *         - translate
 *       properties:
 *         word:
 *           type: string
 *           description: Word in foreign language
 *           example: hello
 *         translate:
 *           type: string
 *           description: Translation of the word
 *           example: привет
 *     
 *     WordDTO:
 *       type: object
 *       required:
 *         - id
 *         - value
 *         - position
 *       properties:
 *         id:
 *           type: integer
 *           description: Word ID
 *           example: 1
 *         value:
 *           type: string
 *           description: Word value
 *           example: How
 *         position:
 *           type: integer
 *           description: Position in sentence
 *           example: 0
 *     
 *     DistractorWordDTO:
 *       type: object
 *       required:
 *         - id
 *         - value
 *       properties:
 *         id:
 *           type: integer
 *           description: Word ID
 *           example: 4
 *         value:
 *           type: string
 *           description: Distractor word value
 *           example: is
 *     
 *     SentenceDTO:
 *       type: object
 *       required:
 *         - id
 *         - text
 *         - words
 *       properties:
 *         id:
 *           type: integer
 *           description: Sentence ID
 *           example: 1
 *         text:
 *           type: string
 *           description: Full sentence text
 *           example: How are you
 *         words:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WordDTO'
 *     
 *     QuestDictationDataDTO:
 *       type: object
 *       required:
 *         - correctSentence
 *       properties:
 *         audioMediaId:
 *           type: integer
 *           description: Audio media ID for playback
 *           example: 1
 *         correctSentence:
 *           $ref: '#/components/schemas/SentenceDTO'
 *         distractorWords:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DistractorWordDTO'
 *     
 *     QuestTranslateDataDTO:
 *       type: object
 *       required:
 *         - sourceSentence
 *         - correctSentence
 *       properties:
 *         sourceSentence:
 *           type: string
 *           description: Sentence to translate
 *           example: Как дела
 *         correctSentence:
 *           $ref: '#/components/schemas/SentenceDTO'
 *         distractorWords:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DistractorWordDTO'
 *     
 *     QuestDTO:
 *       type: object
 *       required:
 *         - id
 *         - type
 *         - levelId
 *         - data
 *       properties:
 *         id:
 *           type: integer
 *           description: Quest ID
 *           example: 1
 *         type:
 *           type: string
 *           enum: [match_words, dictation, translate]
 *           description: Quest type
 *           example: match_words
 *         levelId:
 *           type: integer
 *           description: Level ID this quest belongs to
 *           example: 1
 *         data:
 *           oneOf:
 *             - $ref: '#/components/schemas/QuestMatchWordsDataDTO'
 *             - $ref: '#/components/schemas/QuestDictationDataDTO'
 *             - $ref: '#/components/schemas/QuestTranslateDataDTO'
 *     
 *     CreateQuestMatchWordsInput:
 *       type: object
 *       required:
 *         - type
 *         - levelId
 *         - word
 *         - translate
 *       properties:
 *         type:
 *           type: string
 *           enum: [match_words]
 *           example: match_words
 *         levelId:
 *           type: integer
 *           description: Level ID
 *           example: 1
 *         word:
 *           type: string
 *           description: Word in foreign language
 *           example: apple
 *         translate:
 *           type: string
 *           description: Translation
 *           example: яблоко
 *     
 *     CreateQuestDictationInput:
 *       type: object
 *       required:
 *         - type
 *         - levelId
 *         - text
 *         - language
 *       properties:
 *         type:
 *           type: string
 *           enum: [dictation]
 *           example: dictation
 *         levelId:
 *           type: integer
 *           description: Level ID
 *           example: 1
 *         text:
 *           type: string
 *           description: Text to be dictated (audio will be generated)
 *           example: I like apples
 *         language:
 *           type: string
 *           description: Language code for TTS
 *           example: en
 *         distractorWords:
 *           type: array
 *           items:
 *             type: string
 *           description: Additional words to confuse user
 *           example: [oranges, bananas, grapes]
 *     
 *     CreateQuestTranslateInput:
 *       type: object
 *       required:
 *         - type
 *         - levelId
 *         - sourceSentence
 *         - correctSentence
 *         - targetLanguage
 *       properties:
 *         type:
 *           type: string
 *           enum: [translate]
 *           example: translate
 *         levelId:
 *           type: integer
 *           description: Level ID
 *           example: 1
 *         sourceSentence:
 *           type: string
 *           description: Sentence to translate
 *           example: Я люблю яблоки
 *         correctSentence:
 *           type: string
 *           description: Correct translation
 *           example: I like apples
 *         targetLanguage:
 *           type: string
 *           description: Target language code for TTS
 *           example: en
 *         distractorWords:
 *           type: array
 *           items:
 *             type: string
 *           description: Additional words to confuse user
 *           example: [oranges, bananas]
 *     
 *     SubmitAnswerInput:
 *       type: object
 *       required:
 *         - questId
 *         - answer
 *       properties:
 *         questId:
 *           type: integer
 *           description: Quest ID
 *           example: 1
 *         answer:
 *           oneOf:
 *             - type: string
 *               description: Answer for match_words quest
 *               example: привет
 *             - type: array
 *               items:
 *                 type: string
 *               description: Array of words for dictation/translate quest
 *               example: [How, are, you]
 *     
 *     QuestResultDTO:
 *       type: object
 *       required:
 *         - questId
 *         - correct
 *       properties:
 *         questId:
 *           type: integer
 *           description: Quest ID
 *           example: 1
 *         correct:
 *           type: boolean
 *           description: Whether the answer was correct
 *           example: true
 *         correctAnswer:
 *           oneOf:
 *             - type: string
 *               description: Correct answer for match_words
 *               example: привет
 *             - type: array
 *               items:
 *                 type: string
 *               description: Correct answer for dictation/translate
 *               example: [How, are, you]
 */

export interface WordDTO {
  id: number;
  value: string;
  position: number;
}

export interface DistractorWordDTO {
  id: number;
  value: string;
}

export interface SentenceDTO {
  id: number;
  text: string;
  words: WordDTO[];
}

export interface QuestMatchWordsDataDTO {
  word: string;
  translate: string;
}

export interface QuestDictationDataDTO {
  audioMediaId?: number;
  correctSentence: SentenceDTO;
  distractorWords?: DistractorWordDTO[];
}

export interface QuestTranslateDataDTO {
  sourceSentence: string;
  correctSentence: SentenceDTO;
  distractorWords?: DistractorWordDTO[];
}

export type QuestDataDTO = QuestMatchWordsDataDTO | QuestDictationDataDTO | QuestTranslateDataDTO;

export interface QuestDTO {
  id: number;
  type: 'match_words' | 'dictation' | 'translate';
  levelId: number;
  data: QuestDataDTO;
}

export interface CreateQuestMatchWordsInput {
  type: 'match_words';
  levelId: number;
  word: string;
  translate: string;
}

export interface CreateQuestDictationInput {
  type: 'dictation';
  levelId: number;
  text: string;
  language: string;
  distractorWords?: string[];
}

export interface CreateQuestTranslateInput {
  type: 'translate';
  levelId: number;
  sourceSentence: string;
  correctSentence: string;
  targetLanguage: string;
  distractorWords?: string[];
}

export type CreateQuestInput = CreateQuestMatchWordsInput | CreateQuestDictationInput | CreateQuestTranslateInput;

export interface SubmitAnswerInput {
  questId: number;
  answer: string | string[];
}

export interface QuestResultDTO {
  questId: number;
  correct: boolean;
  correctAnswer?: string | string[];
}
