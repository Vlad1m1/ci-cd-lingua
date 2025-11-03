// Types for Language operations

export interface LanguageData {
	id: number;
	name: string;
	icon: string | null;
}

export interface CreateLanguageInput {
	name: string;
	icon?: string;
}

export interface UpdateLanguageInput {
	name?: string;
	icon?: string;
}
