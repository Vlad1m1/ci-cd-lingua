import { Language } from '../models/entities/Language';
import { User } from '../models/entities/User';
import { ApiError } from '../error/apiError';
import type { CreateLanguageInput, UpdateLanguageInput, LanguageDTO } from '../dtos/language.dto';

class LanguageService {
	async getAllLanguages(): Promise<LanguageDTO[]> {
		const languages = await Language.findAll({
			order: [['name', 'ASC']],
		});

		return languages.map(lang => ({
			id: Number(lang.id),
			name: lang.name,
			icon: lang.icon,
		}));
	}

	async getLanguageById(id: number): Promise<LanguageDTO> {
		const language = await Language.findByPk(id);

		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		return {
			id: Number(language.id),
			name: language.name,
			icon: language.icon,
		};
	}

	async createLanguage(data: CreateLanguageInput): Promise<LanguageDTO> {
		const language = await Language.create({
			name: data.name,
			icon: data.icon || null,
		});

		return {
			id: Number(language.id),
			name: language.name,
			icon: language.icon,
		};
	}

	async updateLanguage(id: number, data: UpdateLanguageInput): Promise<LanguageDTO> {
		const language = await Language.findByPk(id);

		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		if (data.name !== undefined) {
			language.name = data.name;
		}
		if (data.icon !== undefined) {
			language.icon = data.icon;
		}

		await language.save();

		return {
			id: Number(language.id),
			name: language.name,
			icon: language.icon,
		};
	}

	async deleteLanguage(id: number): Promise<void> {
		const language = await Language.findByPk(id);

		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		await language.destroy();
	}

	async setUserLanguage(userId: number, languageId: number): Promise<void> {
		const user = await User.findByPk(userId);

		if (!user) {
			throw ApiError.errorByType('USER_NOT_FOUND');
		}

		const language = await Language.findByPk(languageId);

		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		user.languageId = languageId;
		await user.save();
	}

	async getUserLanguage(userId: number): Promise<LanguageDTO | null> {
		const user = await User.findByPk(userId, {
			include: [Language],
		});

		if (!user) {
			throw ApiError.errorByType('USER_NOT_FOUND');
		}

		if (!user.languageId) {
			return null;
		}

		const language = await Language.findByPk(user.languageId);

		if (!language) {
			return null;
		}

		return {
			id: Number(language.id),
			name: language.name,
			icon: language.icon,
		};
	}
}

const languageService = new LanguageService();
export default languageService;
