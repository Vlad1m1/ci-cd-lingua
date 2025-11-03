import { Quest } from '../models/entities/Quest';
import { QuestMatchWords } from '../models/entities/QuestMatchWords';
import { QuestDictation } from '../models/entities/QuestDictation';
import { QuestTranslate } from '../models/entities/QuestTranslate';
import { Level } from '../models/entities/Level';
import { Sentence } from '../models/entities/Sentence';
import { SentenceWords } from '../models/entities/SentenceWords';
import { Words } from '../models/entities/Words';
import { Distractor } from '../models/entities/Distractor';
import { DistractorWords } from '../models/entities/DistractorWords';
import { AudioMedia } from '../models/entities/AudioMedia';
import { QuestType } from '../models/types/QuestType';
import { ApiError } from '../error/apiError';
import ttsService from './tts.service';
import type {
	QuestDTO,
	CreateQuestInput,
	QuestMatchWordsDataDTO,
	QuestDictationDataDTO,
	QuestTranslateDataDTO,
	SubmitAnswerInput,
	QuestResultDTO,
	WordDTO,
	DistractorWordDTO,
} from '../dtos/quest.dto';
import path from 'path';
import fs from 'fs/promises';

class QuestService {
	private mediaDir = path.join(process.cwd(), 'media');

	constructor() {
		this.ensureMediaDir();
	}

	private async ensureMediaDir(): Promise<void> {
		try {
			await fs.mkdir(this.mediaDir, { recursive: true });
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			// Игнорируем ошибку, если папка уже существует
		}
	}

	async getQuestsByLevel(levelId: number): Promise<QuestDTO[]> {
		const level = await Level.findByPk(levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		const quests = await Quest.findAll({
			where: { levelId },
			order: [['id', 'ASC']],
		});

		const questsData: QuestDTO[] = [];

		for (const quest of quests) {
			const questData = await this.getQuestData(quest);
			questsData.push(questData);
		}

		return questsData;
	}

	async getQuestById(questId: number): Promise<QuestDTO> {
		const quest = await Quest.findByPk(questId);

		if (!quest) {
			throw ApiError.errorByType('QUEST_NOT_FOUND');
		}

		return await this.getQuestData(quest);
	}

	private async getQuestData(quest: Quest): Promise<QuestDTO> {
		const questType = quest.type;

		if (questType === QuestType.MATCH_WORDS) {
			const matchWords = await QuestMatchWords.findOne({
				where: { questId: quest.id },
			});

			if (!matchWords) {
				throw ApiError.errorByType('QUEST_NOT_FOUND');
			}

			const data: QuestMatchWordsDataDTO = {
				word: matchWords.word,
				translate: matchWords.translate,
			};

			return {
				id: Number(quest.id),
				type: 'match_words',
				levelId: Number(quest.levelId),
				data,
			};
		}

		if (questType === QuestType.DICTATION) {
			const dictation = await QuestDictation.findOne({
				where: { questId: quest.id },
			});

			if (!dictation) {
				throw ApiError.errorByType('QUEST_NOT_FOUND');
			}

			const sentence = await Sentence.findByPk(dictation.correctSentenceId);
			if (!sentence) {
				throw ApiError.errorByType('QUEST_NOT_FOUND');
			}

			const sentenceWords = await SentenceWords.findAll({
				where: { sentenceId: sentence.id },
				include: [{ model: Words, as: 'word' }],
				order: [['position', 'ASC']],
			});

			const words: WordDTO[] = sentenceWords.map(sw => ({
				id: Number(sw.wordId),
				value: (sw as unknown as { word: Words }).word.value,
				position: sw.position,
			}));

			let distractorWords: DistractorWordDTO[] | undefined;

			if (dictation.distractorId) {
				const distractorWordsData = await DistractorWords.findAll({
					where: { distractorId: dictation.distractorId },
					include: [{ model: Words, as: 'word' }],
				});

				distractorWords = distractorWordsData.map(dw => ({
					id: Number(dw.wordId),
					value: (dw as unknown as { word: Words }).word.value,
				}));
			}

			const data: QuestDictationDataDTO = {
				audioMediaId: dictation.audioMediaId ? Number(dictation.audioMediaId) : undefined,
				correctSentence: {
					id: Number(sentence.id),
					text: sentence.text,
					words,
				},
				distractorWords,
			};

			return {
				id: Number(quest.id),
				type: 'dictation',
				levelId: Number(quest.levelId),
				data,
			};
		}

		if (questType === QuestType.TRANSLATE) {
			const translate = await QuestTranslate.findOne({
				where: { questId: quest.id },
			});

			if (!translate) {
				throw ApiError.errorByType('QUEST_NOT_FOUND');
			}

			const sentence = await Sentence.findByPk(translate.correctSentenceId);
			if (!sentence) {
				throw ApiError.errorByType('QUEST_NOT_FOUND');
			}

			const sentenceWords = await SentenceWords.findAll({
				where: { sentenceId: sentence.id },
				include: [{ model: Words, as: 'word' }],
				order: [['position', 'ASC']],
			});

			const words: WordDTO[] = sentenceWords.map(sw => ({
				id: Number(sw.wordId),
				value: (sw as unknown as { word: Words }).word.value,
				position: sw.position,
			}));

			let distractorWords: DistractorWordDTO[] | undefined;

			if (translate.distractorId) {
				const distractorWordsData = await DistractorWords.findAll({
					where: { distractorId: translate.distractorId },
					include: [{ model: Words, as: 'word' }],
				});

				distractorWords = distractorWordsData.map(dw => ({
					id: Number(dw.wordId),
					value: (dw as unknown as { word: Words }).word.value,
				}));
			}

			const data: QuestTranslateDataDTO = {
				sourceSentence: translate.sourceSentence,
				correctSentence: {
					id: Number(sentence.id),
					text: sentence.text,
					words,
				},
				distractorWords,
			};

			return {
				id: Number(quest.id),
				type: 'translate',
				levelId: Number(quest.levelId),
				data,
			};
		}

		throw ApiError.errorByType('QUEST_NOT_FOUND');
	}

	async createQuest(data: CreateQuestInput): Promise<QuestDTO> {
		const level = await Level.findByPk(data.levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		if (data.type === 'match_words') {
			const quest = await Quest.create({
				type: QuestType.MATCH_WORDS,
				levelId: data.levelId,
			});

			await QuestMatchWords.create({
				questId: quest.id,
				word: data.word,
				translate: data.translate,
			});

			return await this.getQuestById(Number(quest.id));
		}

		if (data.type === 'dictation') {
			// Создаем аудио
			await ttsService.init();
			const audioResult = await ttsService.synthesize(data.text, { voice: data.language });

			const filename = `dictation_${Date.now()}.wav`;
			const filepath = path.join(this.mediaDir, filename);
			await fs.writeFile(filepath, audioResult.wav);

			const audioMedia = await AudioMedia.create({
				filename,
				mimeType: 'audio/wav',
				duration: null,
				fileSize: audioResult.wav.length,
			});

			// Создаем предложение и слова
			const sentence = await Sentence.create({
				text: data.text,
				audioMediaId: audioMedia.id,
			});

			const wordsArray = data.text.split(/\s+/);
			const createdWords: Words[] = [];

			for (let i = 0; i < wordsArray.length; i++) {
				const wordValue = wordsArray[i];
				let word = await Words.findOne({ where: { value: wordValue } });

				if (!word) {
					word = await Words.create({
						value: wordValue,
						audioMediaId: null,
					});
				}

				createdWords.push(word);

				await SentenceWords.create({
					sentenceId: sentence.id,
					wordId: word.id,
					position: i,
				});
			}

			// Создаем distractor если есть
			let distractorId: number | null = null;

			if (data.distractorWords && data.distractorWords.length > 0) {
				const distractor = await Distractor.create({});
				distractorId = Number(distractor.id);

				for (const distractorWord of data.distractorWords) {
					let word = await Words.findOne({ where: { value: distractorWord } });

					if (!word) {
						word = await Words.create({
							value: distractorWord,
							audioMediaId: null,
						});
					}

					await DistractorWords.create({
						distractorId: distractor.id,
						wordId: word.id,
					});
				}
			}

			const quest = await Quest.create({
				type: QuestType.DICTATION,
				levelId: data.levelId,
			});

			await QuestDictation.create({
				questId: quest.id,
				audioMediaId: audioMedia.id,
				correctSentenceId: sentence.id,
				distractorId,
			});

			return await this.getQuestById(Number(quest.id));
		}

		if (data.type === 'translate') {
			// Создаем предложение и слова
			const sentence = await Sentence.create({
				text: data.correctSentence,
				audioMediaId: null,
			});

			const wordsArray = data.correctSentence.split(/\s+/);
			const createdWords: Words[] = [];

			for (let i = 0; i < wordsArray.length; i++) {
				const wordValue = wordsArray[i];
				let word = await Words.findOne({ where: { value: wordValue } });

				if (!word) {
					// Создаем аудио для слова
					await ttsService.init();
					const audioResult = await ttsService.synthesize(wordValue, { voice: data.targetLanguage });

					const filename = `word_${Date.now()}_${i}.wav`;
					const filepath = path.join(this.mediaDir, filename);
					await fs.writeFile(filepath, audioResult.wav);

					const audioMedia = await AudioMedia.create({
						filename,
						mimeType: 'audio/wav',
						duration: null,
						fileSize: audioResult.wav.length,
					});

					word = await Words.create({
						value: wordValue,
						audioMediaId: audioMedia.id,
					});
				}

				createdWords.push(word);

				await SentenceWords.create({
					sentenceId: sentence.id,
					wordId: word.id,
					position: i,
				});
			}

			// Создаем distractor если есть
			let distractorId: number | null = null;

			if (data.distractorWords && data.distractorWords.length > 0) {
				const distractor = await Distractor.create({});
				distractorId = Number(distractor.id);

				for (const distractorWord of data.distractorWords) {
					let word = await Words.findOne({ where: { value: distractorWord } });

					if (!word) {
						word = await Words.create({
							value: distractorWord,
							audioMediaId: null,
						});
					}

					await DistractorWords.create({
						distractorId: distractor.id,
						wordId: word.id,
					});
				}
			}

			const quest = await Quest.create({
				type: QuestType.TRANSLATE,
				levelId: data.levelId,
			});

			await QuestTranslate.create({
				questId: quest.id,
				sourceSentence: data.sourceSentence,
				correctSentenceId: sentence.id,
				distractorId,
			});

			return await this.getQuestById(Number(quest.id));
		}

		throw ApiError.errorByType('BAD_REQUEST');
	}

	async submitAnswer(userId: number, data: SubmitAnswerInput): Promise<QuestResultDTO> {
		const quest = await Quest.findByPk(data.questId);

		if (!quest) {
			throw ApiError.errorByType('QUEST_NOT_FOUND');
		}

		if (quest.type === QuestType.MATCH_WORDS) {
			if (typeof data.answer !== 'string') {
				throw ApiError.errorByType('INVALID_ANSWER');
			}

			const matchWords = await QuestMatchWords.findOne({
				where: { questId: quest.id },
			});

			if (!matchWords) {
				throw ApiError.errorByType('QUEST_NOT_FOUND');
			}

			const correct = data.answer.toLowerCase().trim() === matchWords.translate.toLowerCase().trim();

			return {
				questId: Number(quest.id),
				correct,
				correctAnswer: matchWords.translate,
			};
		}

		if (quest.type === QuestType.DICTATION || quest.type === QuestType.TRANSLATE) {
			if (!Array.isArray(data.answer)) {
				throw ApiError.errorByType('INVALID_ANSWER');
			}

			let correctSentenceId: number;

			if (quest.type === QuestType.DICTATION) {
				const dictation = await QuestDictation.findOne({
					where: { questId: quest.id },
				});

				if (!dictation) {
					throw ApiError.errorByType('QUEST_NOT_FOUND');
				}

				correctSentenceId = Number(dictation.correctSentenceId);
			} else {
				const translate = await QuestTranslate.findOne({
					where: { questId: quest.id },
				});

				if (!translate) {
					throw ApiError.errorByType('QUEST_NOT_FOUND');
				}

				correctSentenceId = Number(translate.correctSentenceId);
			}

			const sentenceWords = await SentenceWords.findAll({
				where: { sentenceId: correctSentenceId },
				include: [{ model: Words, as: 'word' }],
				order: [['position', 'ASC']],
			});

			const correctAnswer = sentenceWords.map(sw => (sw as unknown as { word: Words }).word.value);

			// Сравниваем ответы (нормализуем регистр)
			const correct =
				data.answer.length === correctAnswer.length &&
				data.answer.every((word, index) => word.toLowerCase().trim() === correctAnswer[index].toLowerCase().trim());

			return {
				questId: Number(quest.id),
				correct,
				correctAnswer,
			};
		}

		throw ApiError.errorByType('BAD_REQUEST');
	}

	async deleteQuest(questId: number): Promise<void> {
		const quest = await Quest.findByPk(questId);

		if (!quest) {
			throw ApiError.errorByType('QUEST_NOT_FOUND');
		}

		// Удаляем связанные записи в зависимости от типа квеста
		if (quest.type === QuestType.MATCH_WORDS) {
			await QuestMatchWords.destroy({ where: { questId: quest.id } });
		} else if (quest.type === QuestType.DICTATION) {
			const dictation = await QuestDictation.findOne({ where: { questId: quest.id } });
			if (dictation) {
				await QuestDictation.destroy({ where: { questId: quest.id } });
			}
		} else if (quest.type === QuestType.TRANSLATE) {
			const translate = await QuestTranslate.findOne({ where: { questId: quest.id } });
			if (translate) {
				await QuestTranslate.destroy({ where: { questId: quest.id } });
			}
		}

		await quest.destroy();
	}
}

const questService = new QuestService();
export default questService;
