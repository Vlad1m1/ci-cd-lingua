const API_ERROR = {
	BAD_REQUEST: {
		type: 'BAD_REQUEST',
		description: 'Bad request.',
		code: 400,
	},
	UNAUTHORIZED: {
		type: 'UNAUTHORIZED',
		description: 'Unauthorized.',
		code: 401,
	},
	FORBIDDEN: {
		type: 'FORBIDDEN',
		description: 'Access forbidden.',
		code: 403,
	},
	NOT_FOUND: {
		type: 'NOT_FOUND',
		description: 'Not found.',
		code: 404,
	},
	LANGUAGE_NOT_FOUND: {
		type: 'LANGUAGE_NOT_FOUND',
		description: 'Language not found.',
		code: 404,
	},
	MODULE_NOT_FOUND: {
		type: 'MODULE_NOT_FOUND',
		description: 'Module not found.',
		code: 404,
	},
	LEVEL_NOT_FOUND: {
		type: 'LEVEL_NOT_FOUND',
		description: 'Level not found.',
		code: 404,
	},
	QUEST_NOT_FOUND: {
		type: 'QUEST_NOT_FOUND',
		description: 'Quest not found.',
		code: 404,
	},
	USER_NOT_FOUND: {
		type: 'USER_NOT_FOUND',
		description: 'User not found.',
		code: 404,
	},
	INVALID_ANSWER: {
		type: 'INVALID_ANSWER',
		description: 'Invalid answer format.',
		code: 400,
	},
	ADMIN_REQUIRED: {
		type: 'ADMIN_REQUIRED',
		description: 'Admin access required.',
		code: 403,
	},
	FRIEND_REQUEST_NOT_FOUND: {
		type: 'FRIEND_REQUEST_NOT_FOUND',
		description: 'Friend request not found.',
		code: 404,
	},
	FRIEND_REQUEST_ALREADY_EXISTS: {
		type: 'FRIEND_REQUEST_ALREADY_EXISTS',
		description: 'Friend request already exists.',
		code: 400,
	},
	ALREADY_FRIENDS: {
		type: 'ALREADY_FRIENDS',
		description: 'Users are already friends.',
		code: 400,
	},
	CANNOT_ADD_YOURSELF: {
		type: 'CANNOT_ADD_YOURSELF',
		description: 'Cannot send friend request to yourself.',
		code: 400,
	},
	NOT_REQUEST_PARTICIPANT: {
		type: 'NOT_REQUEST_PARTICIPANT',
		description: 'You are not a participant of this friend request.',
		code: 403,
	},
	REQUEST_ALREADY_RESPONDED: {
		type: 'REQUEST_ALREADY_RESPONDED',
		description: 'Friend request has already been responded to.',
		code: 400,
	},
	INTERNAL_SERVER_ERROR: {
		type: 'INTERNAL_SERVER_ERROR',
		description: 'Internal server error.',
		code: 500,
	},
};

type ErrorKeys = keyof typeof API_ERROR;

export {
	API_ERROR,
	ErrorKeys
};
