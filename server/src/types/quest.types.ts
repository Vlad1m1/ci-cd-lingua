// Types for Quest-related operations

export interface QuestMatchWordsData {
	word: string;
	translate: string;
}

export interface QuestDictationData {
	audioMediaId: number | null;
	correctSentence: {
		id: number;
		text: string;
		words: Array<{ id: number; value: string; position: number }>;
	};
	distractorWords?: Array<{ id: number; value: string }>;
}

export interface QuestTranslateData {
	sourceSentence: string;
	correctSentence: {
		id: number;
		text: string;
		words: Array<{ id: number; value: string; position: number }>;
	};
	distractorWords?: Array<{ id: number; value: string }>;
}

export interface QuestData {
	id: number;
	type: 'match_words' | 'dictation' | 'translate';
	levelId: number;
	data: QuestMatchWordsData | QuestDictationData | QuestTranslateData;
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
	answer: string | string[]; // string for match_words, string[] for dictation/translate
}

export interface QuestResult {
	questId: number;
	correct: boolean;
	correctAnswer?: string | string[];
}
