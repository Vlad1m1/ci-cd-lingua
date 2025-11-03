import type { Request, Response, NextFunction } from 'express';
import questService from '../services/quest.service';
import type { CreateQuestInput, SubmitAnswerInput } from '../dtos/quest.dto';

class QuestController {
	// GET /api/quests/level/:levelId - получить квесты уровня
	async getQuestsByLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const levelId = parseInt(req.params.levelId);
			const quests = await questService.getQuestsByLevel(levelId);
			res.json(quests);
		} catch (error) {
			next(error);
		}
	}

	// GET /api/quests/:id - получить квест по ID
	async getQuestById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const quest = await questService.getQuestById(id);
			res.json(quest);
		} catch (error) {
			next(error);
		}
	}

	// POST /api/quests - создать квест (admin)
	async createQuest(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data: CreateQuestInput = req.body;
			const quest = await questService.createQuest(data);
			res.status(201).json(quest);
		} catch (error) {
			next(error);
		}
	}

	// POST /api/quests/submit - отправить ответ на квест
	async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const data: SubmitAnswerInput = req.body;
			const result = await questService.submitAnswer(userId, data);
			res.json(result);
		} catch (error) {
			next(error);
		}
	}

	// DELETE /api/quests/:id - удалить квест (admin)
	async deleteQuest(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			await questService.deleteQuest(id);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}
}

const questController = new QuestController();
export default questController;
