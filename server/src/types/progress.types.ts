// Types for User Progress operations

export interface UserLevelProgress {
	id: number;
	userId: number;
	levelId: number;
	questsCount: number;
	score: number;
	stars: number;
	exp: number;
}

export interface UserStats {
	totalStars: number;
	totalExp: number;
	completedLevels: number;
	currentLevel?: {
		levelId: number;
		levelName: string;
		progress: number; // percentage
		questsCompleted: number;
		totalQuests: number;
	};
}

export interface SaveProgressInput {
	levelId: number;
	questId: number;
	correct: boolean;
}
