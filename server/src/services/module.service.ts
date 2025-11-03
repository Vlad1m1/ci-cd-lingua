import { Module } from '../models/entities/Module';
import { Level } from '../models/entities/Level';
import { UserLevel } from '../models/entities/UserLevel';
import { Language } from '../models/entities/Language';
import { ApiError } from '../error/apiError';
import type {
	ModuleDTO,
	LevelDTO,
	ModuleWithLevelsDTO,
	LevelWithProgressDTO,
	CreateModuleInput,
	UpdateModuleInput,
	CreateLevelInput,
	UpdateLevelInput,
} from '../dtos/module.dto';

class ModuleService {
	// Modules
	async getModulesByLanguage(languageId: number, userId?: number): Promise<ModuleWithLevelsDTO[]> {
		const language = await Language.findByPk(languageId);
		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		const modules = await Module.findAll({
			where: { languageId },
			order: [['id', 'ASC']],
		});

		const modulesWithLevels: ModuleWithLevelsDTO[] = [];

		for (const module of modules) {
			const levels = await Level.findAll({
				where: { moduleId: module.id },
				order: [['id', 'ASC']],
			});

			const levelsWithProgress: LevelWithProgressDTO[] = [];

			for (const level of levels) {
				const levelData: LevelWithProgressDTO = {
					id: Number(level.id),
					moduleId: Number(level.moduleId),
					name: level.name,
					questsCount: level.questsCount,
				};

				if (userId) {
					const userLevel = await UserLevel.findOne({
						where: {
							userId,
							levelId: level.id,
						},
					});

					if (userLevel) {
						levelData.userProgress = {
							questsCompleted: userLevel.questsCount,
							score: userLevel.score,
							stars: userLevel.score, // stars = score согласно требованиям
						};
					}
				}

				levelsWithProgress.push(levelData);
			}

			modulesWithLevels.push({
				id: Number(module.id),
				languageId: Number(module.languageId),
				name: module.name,
				icon: module.icon,
				levels: levelsWithProgress,
			});
		}

		return modulesWithLevels;
	}

	async getModuleById(id: number): Promise<ModuleDTO> {
		const module = await Module.findByPk(id);

		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		return {
			id: Number(module.id),
			languageId: Number(module.languageId),
			name: module.name,
			icon: module.icon,
		};
	}

	async createModule(data: CreateModuleInput): Promise<ModuleDTO> {
		const language = await Language.findByPk(data.languageId);
		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		const module = await Module.create({
			languageId: data.languageId,
			name: data.name,
			icon: data.icon || null,
		});

		return {
			id: Number(module.id),
			languageId: Number(module.languageId),
			name: module.name,
			icon: module.icon,
		};
	}

	async updateModule(id: number, data: UpdateModuleInput): Promise<ModuleDTO> {
		const module = await Module.findByPk(id);

		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		if (data.name !== undefined) {
			module.name = data.name;
		}
		if (data.icon !== undefined) {
			module.icon = data.icon;
		}

		await module.save();

		return {
			id: Number(module.id),
			languageId: Number(module.languageId),
			name: module.name,
			icon: module.icon,
		};
	}

	async deleteModule(id: number): Promise<void> {
		const module = await Module.findByPk(id);

		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		await module.destroy();
	}

	// Levels
	async getLevelById(id: number): Promise<LevelDTO> {
		const level = await Level.findByPk(id);

		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		return {
			id: Number(level.id),
			moduleId: Number(level.moduleId),
			name: level.name,
			questsCount: level.questsCount,
		};
	}

	async createLevel(data: CreateLevelInput): Promise<LevelDTO> {
		const module = await Module.findByPk(data.moduleId);
		if (!module) {
			throw ApiError.errorByType('MODULE_NOT_FOUND');
		}

		const level = await Level.create({
			moduleId: data.moduleId,
			name: data.name,
			questsCount: data.questsCount,
		});

		return {
			id: Number(level.id),
			moduleId: Number(level.moduleId),
			name: level.name,
			questsCount: level.questsCount,
		};
	}

	async updateLevel(id: number, data: UpdateLevelInput): Promise<LevelDTO> {
		const level = await Level.findByPk(id);

		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		if (data.name !== undefined) {
			level.name = data.name;
		}
		if (data.questsCount !== undefined) {
			level.questsCount = data.questsCount;
		}

		await level.save();

		return {
			id: Number(level.id),
			moduleId: Number(level.moduleId),
			name: level.name,
			questsCount: level.questsCount,
		};
	}

	async deleteLevel(id: number): Promise<void> {
		const level = await Level.findByPk(id);

		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		await level.destroy();
	}
}

const moduleService = new ModuleService();
export default moduleService;
