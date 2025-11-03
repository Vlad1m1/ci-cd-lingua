import type { Request, Response, NextFunction } from 'express';
import moduleService from '../services/module.service';
import type { 
	CreateModuleInput, 
	UpdateModuleInput, 
	CreateLevelInput, 
	UpdateLevelInput 
} from '../dtos/module.dto';

class ModuleController {
	// GET /api/modules/:languageId - получить модули по языку с уровнями и прогрессом
	async getModulesByLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const languageId = parseInt(req.params.languageId);
			const userId = req.user?.userId;
			const modules = await moduleService.getModulesByLanguage(languageId, userId);
			res.json(modules);
		} catch (error) {
			next(error);
		}
	}

	// GET /api/modules/single/:id - получить модуль по ID
	async getModuleById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const module = await moduleService.getModuleById(id);
			res.json(module);
		} catch (error) {
			next(error);
		}
	}

	// POST /api/modules - создать модуль (admin)
	async createModule(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data: CreateModuleInput = req.body;
			const module = await moduleService.createModule(data);
			res.status(201).json(module);
		} catch (error) {
			next(error);
		}
	}

	// PUT /api/modules/:id - обновить модуль (admin)
	async updateModule(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const data: UpdateModuleInput = req.body;
			const module = await moduleService.updateModule(id, data);
			res.json(module);
		} catch (error) {
			next(error);
		}
	}

	// DELETE /api/modules/:id - удалить модуль (admin)
	async deleteModule(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			await moduleService.deleteModule(id);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}

	// GET /api/levels/:id - получить уровень по ID
	async getLevelById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const level = await moduleService.getLevelById(id);
			res.json(level);
		} catch (error) {
			next(error);
		}
	}

	// POST /api/levels - создать уровень (admin)
	async createLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const data: CreateLevelInput = req.body;
			const level = await moduleService.createLevel(data);
			res.status(201).json(level);
		} catch (error) {
			next(error);
		}
	}

	// PUT /api/levels/:id - обновить уровень (admin)
	async updateLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			const data: UpdateLevelInput = req.body;
			const level = await moduleService.updateLevel(id, data);
			res.json(level);
		} catch (error) {
			next(error);
		}
	}

	// DELETE /api/levels/:id - удалить уровень (admin)
	async deleteLevel(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = parseInt(req.params.id);
			await moduleService.deleteLevel(id);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}
}

const moduleController = new ModuleController();
export default moduleController;
