import type { Request, Response, NextFunction } from 'express';
import express from 'express';
import path from 'path';
import { ROOT_PATH } from '../index';
import fs from "fs";
import Logger from "../utils/logger";

export function setupStaticMiddleware(app: express.Application) {
	const frontendDistPath = path.join(ROOT_PATH, 'static');
	const indexPath = path.join(frontendDistPath, 'index.html');
	
	if (!fs.existsSync(indexPath)) {
		Logger.warn(`[Static] Файл {static}/index.html не найден`);
		return;
	}
	
	app.use(express.static(frontendDistPath));
	
	app.use((req: Request, res: Response, next: NextFunction) => {
		if (req.method !== 'GET') return next();
		if (req.path.startsWith('/api')) return next();
		
		const hasExtension = path.extname(req.path) !== '';
		if (hasExtension) return next();
		
		res.sendFile(path.join(frontendDistPath, 'index.html'));
	});
}
