import type { Request, Response, NextFunction } from 'express';
import progressService from '../services/progress.service';
import type { SaveProgressInput } from '../dtos/progress.dto';

class ProgressController {
	// POST /api/progress/save - сохранить прогресс
	async saveProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const data: SaveProgressInput = req.body;
			const progress = await progressService.saveProgress(userId, data);
			res.json(progress);
		} catch (error) {
			next(error);
		}
	}

	// GET /api/progress/stats - получить статистику пользователя
	async getUserStats(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const stats = await progressService.getUserStats(userId);
			res.json(stats);
		} catch (error) {
			next(error);
		}
	}

	// GET /api/progress/level/:levelId - получить прогресс уровня
	async getLevelProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const levelId = parseInt(req.params.levelId);
			const progress = await progressService.getLevelProgress(userId, levelId);
			res.json(progress);
		} catch (error) {
			next(error);
		}
	}
}

const progressController = new ProgressController();
export default progressController;
