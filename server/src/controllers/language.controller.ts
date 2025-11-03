import type { Request, Response, NextFunction } from 'express';
import languageService from '../services/language.service';
import type { 
	CreateLanguageInput, 
	UpdateLanguageInput, 
	SetUserLanguageInput 
} from '../dtos/language.dto';

class LanguageController {
	// GET /api/languages - получить все языки
	async getAllLanguages(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const languages = await languageService.getAllLanguages();
			res.json(languages);
		} catch (error) {
			next(error);
		}
	}

	// GET /api/languages/:id - получить язык по ID
	async getLanguageById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const language = await languageService.getLanguageById(id);
			res.json(language);
		} catch (error) {
			next(error);
		}
	}

	// POST /api/languages - создать язык (admin)
	async createLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data: CreateLanguageInput = req.body;
			const language = await languageService.createLanguage(data);
			res.status(201).json(language);
		} catch (error) {
			next(error);
		}
	}

	// PUT /api/languages/:id - обновить язык (admin)
	async updateLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const data: UpdateLanguageInput = req.body;
			const language = await languageService.updateLanguage(id, data);
			res.json(language);
		} catch (error) {
			next(error);
		}
	}

	// DELETE /api/languages/:id - удалить язык (admin)
	async deleteLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			await languageService.deleteLanguage(id);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}

	// PUT /api/languages/user/set - установить язык пользователю
	async setUserLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const { languageId }: SetUserLanguageInput = req.body;
			await languageService.setUserLanguage(userId, languageId);
			res.json({ message: 'Language set successfully' });
		} catch (error) {
			next(error);
		}
	}

	// GET /api/languages/user/current - получить текущий язык пользователя
	async getUserLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user!.userId;
			const language = await languageService.getUserLanguage(userId);
			res.json(language);
		} catch (error) {
			next(error);
		}
	}
}

const languageController = new LanguageController();
export default languageController;
