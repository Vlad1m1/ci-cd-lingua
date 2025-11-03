import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../error/apiError';
import { User } from '../models/entities/User';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		if (!req.user) {
			throw ApiError.errorByType('UNAUTHORIZED');
		}

		const user = await User.findByPk(req.user.userId);

		if (!user) {
			throw ApiError.errorByType('USER_NOT_FOUND');
		}

		if (user.role !== 'admin') {
			throw ApiError.errorByType('ADMIN_REQUIRED');
		}

		next();
	} catch (error) {
		next(error);
	}
};
