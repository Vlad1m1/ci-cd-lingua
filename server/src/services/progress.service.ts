import { User } from '../models/entities/User';
import { UserLevel } from '../models/entities/UserLevel';
import { Level } from '../models/entities/Level';
import { Module } from '../models/entities/Module';
import { ApiError } from '../error/apiError';
import type { UserStatsDTO, UserLevelProgressDTO, SaveProgressInput } from '../dtos/progress.dto';

class ProgressService {
	async saveProgress(userId: number, data: SaveProgressInput): Promise<UserLevelProgressDTO> {
		const user = await User.findByPk(userId);
		if (!user) {
			throw ApiError.errorByType('USER_NOT_FOUND');
		}

		const level = await Level.findByPk(data.levelId);
		if (!level) {
			throw ApiError.errorByType('LEVEL_NOT_FOUND');
		}

		let userLevel = await UserLevel.findOne({
			where: {
				userId,
				levelId: data.levelId,
			},
		});

		if (!userLevel) {
			// Создаем новую запись прогресса
			userLevel = await UserLevel.create({
				userId,
				levelId: data.levelId,
				questsCount: data.correct ? 1 : 0,
				score: data.correct ? 1 : 0,
			});
		} else {
			// Обновляем существующий прогресс
			userLevel.questsCount += 1;
			if (data.correct) {
				userLevel.score += 1;
			}
			await userLevel.save();
		}

		// Обновляем общие stats пользователя
		const stars = userLevel.score; // stars = score согласно требованиям
		const exp = Math.floor(userLevel.score / 100); // exp = score/100

		// Обновляем общие звезды и опыт пользователя
		const totalStars = await this.calculateTotalStars(userId);
		const totalExp = await this.calculateTotalExp(userId);

		user.stars = totalStars;
		user.exp = totalExp;
		await user.save();

		return {
			id: Number(userLevel.id),
			userId: Number(userLevel.userId),
			levelId: Number(userLevel.levelId),
			questsCount: userLevel.questsCount,
			score: userLevel.score,
			stars,
			exp,
		};
	}

	async getUserStats(userId: number): Promise<UserStatsDTO> {
		const user = await User.findByPk(userId);
		if (!user) {
			throw ApiError.errorByType('USER_NOT_FOUND');
		}

		const userLevels = await UserLevel.findAll({
			where: { userId },
			include: [{ model: Level, as: 'level' }],
		});

		const totalStars = await this.calculateTotalStars(userId);
		const totalExp = await this.calculateTotalExp(userId);

		// Считаем пройденные уровни (где questsCount >= level.questsCount)
		let completedLevels = 0;
		for (const userLevel of userLevels) {
			const level = (userLevel as unknown as { level: Level }).level;
			if (userLevel.questsCount >= level.questsCount) {
				completedLevels++;
			}
		}

		// Находим текущий незавершенный уровень
		let currentLevel: UserStatsDTO['currentLevel'] | undefined;

		if (user.languageId) {
			// Получаем все модули языка
			const modules = await Module.findAll({
				where: { languageId: user.languageId },
				include: [{ model: Level, as: 'levels' }],
				order: [['id', 'ASC']],
			});

			// Ищем первый незавершенный уровень
			for (const module of modules) {
				const levels = (module as unknown as { levels: Level[] }).levels;
				for (const level of levels) {
					const userLevel = await UserLevel.findOne({
						where: { userId, levelId: level.id },
					});

					if (!userLevel || userLevel.questsCount < level.questsCount) {
						const questsCompleted = userLevel ? userLevel.questsCount : 0;
						const progress = (questsCompleted / level.questsCount) * 100;

						currentLevel = {
							levelId: Number(level.id),
							levelName: level.name,
							progress,
							questsCompleted,
							totalQuests: level.questsCount,
						};
						break;
					}
				}
				if (currentLevel) break;
			}
		}

		return {
			totalStars,
			totalExp,
			completedLevels,
			currentLevel,
		};
	}

	async getLevelProgress(userId: number, levelId: number): Promise<UserLevelProgressDTO | null> {
		const userLevel = await UserLevel.findOne({
			where: { userId, levelId },
		});

		if (!userLevel) {
			return null;
		}

		const stars = userLevel.score;
		const exp = Math.floor(userLevel.score / 100);

		return {
			id: Number(userLevel.id),
			userId: Number(userLevel.userId),
			levelId: Number(userLevel.levelId),
			questsCount: userLevel.questsCount,
			score: userLevel.score,
			stars,
			exp,
		};
	}

	private async calculateTotalStars(userId: number): Promise<number> {
		const userLevels = await UserLevel.findAll({
			where: { userId },
		});

		return userLevels.reduce((total, ul) => total + ul.score, 0);
	}

	private async calculateTotalExp(userId: number): Promise<number> {
		const userLevels = await UserLevel.findAll({
			where: { userId },
		});

		return userLevels.reduce((total, ul) => total + Math.floor(ul.score / 100), 0);
	}
}

const progressService = new ProgressService();
export default progressService;
