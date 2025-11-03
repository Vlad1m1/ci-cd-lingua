import type { Request, Response, NextFunction } from 'express';
import friendService from '../services/friend.service';
import { ApiError } from '../error/apiError';

/**
 * @openapi
 * tags:
 *   - name: Friends
 *     description: Friend management and friend requests
 */
class FriendController {
	/**
	 * Send a friend request
	 * @example
	 * Request body:
	 * {
	 *   "addresseeId": 2
	 * }
	 * 
	 * Response:
	 * {
	 *   "id": 1,
	 *   "requesterId": 1,
	 *   "addresseeId": 2,
	 *   "status": "PENDING",
	 *   "createdAt": "2024-01-01T00:00:00.000Z",
	 *   "respondedAt": null,
	 *   "addressee": {
	 *     "id": 2,
	 *     "username": "jane_doe",
	 *     "firstName": "Jane",
	 *     "lastName": "Doe",
	 *     "photoUrl": "https://example.com/photo.jpg",
	 *     "stars": 50,
	 *     "exp": 200
	 *   }
	 * }
	 */
	async sendRequest(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				throw ApiError.errorByType('UNAUTHORIZED');
			}

			const { addresseeId } = req.body;

			if (!addresseeId || typeof addresseeId !== 'number') {
				throw ApiError.errorByType('BAD_REQUEST');
			}

			const friendRequest = await friendService.sendFriendRequest(req.user.userId, addresseeId);

			return res.status(201).json(friendRequest);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Respond to a friend request (accept or reject)
	 * @example
	 * Request body:
	 * {
	 *   "accept": true
	 * }
	 * 
	 * Response:
	 * {
	 *   "id": 1,
	 *   "requesterId": 2,
	 *   "addresseeId": 1,
	 *   "status": "ACCEPTED",
	 *   "createdAt": "2024-01-01T00:00:00.000Z",
	 *   "respondedAt": "2024-01-01T01:00:00.000Z",
	 *   "requester": {
	 *     "id": 2,
	 *     "username": "jane_doe",
	 *     "firstName": "Jane",
	 *     "lastName": "Doe",
	 *     "photoUrl": "https://example.com/photo.jpg",
	 *     "stars": 50,
	 *     "exp": 200
	 *   }
	 * }
	 */
	async respondToRequest(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				throw ApiError.errorByType('UNAUTHORIZED');
			}

			const { requestId } = req.params;
			const { accept } = req.body;

			if (!requestId || accept === undefined || typeof accept !== 'boolean') {
				throw ApiError.errorByType('BAD_REQUEST');
			}

			const friendRequest = await friendService.respondToFriendRequest(
				parseInt(requestId),
				req.user.userId,
				accept
			);

			return res.json(friendRequest);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Cancel a friend request
	 * @example
	 * Response:
	 * {
	 *   "message": "Friend request canceled"
	 * }
	 */
	async cancelRequest(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				throw ApiError.errorByType('UNAUTHORIZED');
			}

			const { requestId } = req.params;

			if (!requestId) {
				throw ApiError.errorByType('BAD_REQUEST');
			}

			await friendService.cancelFriendRequest(parseInt(requestId), req.user.userId);

			return res.json({ message: 'Friend request canceled' });
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get incoming friend requests
	 * @example
	 * Response:
	 * [
	 *   {
	 *     "id": 1,
	 *     "requesterId": 2,
	 *     "addresseeId": 1,
	 *     "status": "PENDING",
	 *     "createdAt": "2024-01-01T00:00:00.000Z",
	 *     "respondedAt": null,
	 *     "requester": {
	 *       "id": 2,
	 *       "username": "jane_doe",
	 *       "firstName": "Jane",
	 *       "lastName": "Doe",
	 *       "photoUrl": "https://example.com/photo.jpg",
	 *       "stars": 50,
	 *       "exp": 200
	 *     }
	 *   }
	 * ]
	 */
	async getIncomingRequests(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				throw ApiError.errorByType('UNAUTHORIZED');
			}

			const requests = await friendService.getIncomingRequests(req.user.userId);

			return res.json(requests);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get outgoing friend requests
	 * @example
	 * Response:
	 * [
	 *   {
	 *     "id": 1,
	 *     "requesterId": 1,
	 *     "addresseeId": 2,
	 *     "status": "PENDING",
	 *     "createdAt": "2024-01-01T00:00:00.000Z",
	 *     "respondedAt": null,
	 *     "addressee": {
	 *       "id": 2,
	 *       "username": "jane_doe",
	 *       "firstName": "Jane",
	 *       "lastName": "Doe",
	 *       "photoUrl": "https://example.com/photo.jpg",
	 *       "stars": 50,
	 *       "exp": 200
	 *     }
	 *   }
	 * ]
	 */
	async getOutgoingRequests(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				throw ApiError.errorByType('UNAUTHORIZED');
			}

			const requests = await friendService.getOutgoingRequests(req.user.userId);

			return res.json(requests);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Get list of friends
	 * @example
	 * Response:
	 * [
	 *   {
	 *     "id": 2,
	 *     "username": "jane_doe",
	 *     "firstName": "Jane",
	 *     "lastName": "Doe",
	 *     "photoUrl": "https://example.com/photo.jpg",
	 *     "stars": 50,
	 *     "exp": 200,
	 *     "friendsSince": "2024-01-01T00:00:00.000Z"
	 *   }
	 * ]
	 */
	async getFriends(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				throw ApiError.errorByType('UNAUTHORIZED');
			}

			const friends = await friendService.getFriends(req.user.userId);

			return res.json(friends);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Remove a friend
	 * @example
	 * Response:
	 * {
	 *   "message": "Friend removed"
	 * }
	 */
	async removeFriend(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				throw ApiError.errorByType('UNAUTHORIZED');
			}

			const { friendId } = req.params;

			if (!friendId) {
				throw ApiError.errorByType('BAD_REQUEST');
			}

			await friendService.removeFriend(req.user.userId, parseInt(friendId));

			return res.json({ message: 'Friend removed' });
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Search users
	 * @example
	 * Response:
	 * [
	 *   {
	 *     "id": 3,
	 *     "username": "john_smith",
	 *     "firstName": "John",
	 *     "lastName": "Smith",
	 *     "photoUrl": "https://example.com/photo.jpg",
	 *     "stars": 100,
	 *     "exp": 500
	 *   }
	 * ]
	 */
	async searchUsers(req: Request, res: Response, next: NextFunction) {
		try {
			if (!req.user) {
				throw ApiError.errorByType('UNAUTHORIZED');
			}

			const { query } = req.query;
			const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

			if (!query || typeof query !== 'string') {
				throw ApiError.errorByType('BAD_REQUEST');
			}

			const users = await friendService.searchUsers(req.user.userId, query, limit);

			return res.json(users);
		} catch (error) {
			next(error);
		}
	}
}

export default new FriendController();
