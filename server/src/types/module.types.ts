// Types for Module and Level operations

export interface ModuleData {
	id: number;
	languageId: number;
	name: string;
	icon: string | null;
}

export interface LevelData {
	id: number;
	moduleId: number;
	name: string;
	questsCount: number;
}

export interface LevelWithProgress extends LevelData {
	userProgress?: {
		questsCompleted: number;
		score: number;
		stars: number;
	};
}

export interface ModuleWithLevels extends ModuleData {
	levels: LevelWithProgress[];
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
