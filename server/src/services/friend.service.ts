import { Op } from 'sequelize';
import { User } from '../models/entities/User';
import { FriendRequest } from '../models/entities/FriendRequest';
import { Friends } from '../models/entities/Friends';
import { FriendRequestStatus } from '../models/types/FriendRequestStatus';
import { ApiError } from '../error/apiError';
import logger from '../utils/logger';
import { FriendRequestDTO, FriendDTO, UserShortDTO } from '../dtos/friend.dto';
import sequelize from '../models/db';

export class FriendService {
	/**
	 * Send a friend request
	 */
	async sendFriendRequest(requesterId: number, addresseeId: number): Promise<FriendRequestDTO> {
		// Check if trying to add yourself
		if (requesterId === addresseeId) {
			throw ApiError.errorByType('CANNOT_ADD_YOURSELF');
		}

		// Check if addressee exists
		const addressee = await User.findByPk(addresseeId);
		if (!addressee) {
			throw ApiError.errorByType('USER_NOT_FOUND');
		}

		// Check if already friends
		const areFriends = await this.checkIfFriends(requesterId, addresseeId);
		if (areFriends) {
			throw ApiError.errorByType('ALREADY_FRIENDS');
		}

		// Check if there's an existing pending request
		const existingRequest = await FriendRequest.findOne({
			where: {
				[Op.or]: [
					{ requesterId, addresseeId },
					{ requesterId: addresseeId, addresseeId: requesterId }
				],
				status: FriendRequestStatus.PENDING
			}
		});

		if (existingRequest) {
			throw ApiError.errorByType('FRIEND_REQUEST_ALREADY_EXISTS');
		}

		// Create new friend request
		const friendRequest = await FriendRequest.create({
			requesterId,
			addresseeId,
			status: FriendRequestStatus.PENDING,
		});

		const requester = await User.findByPk(requesterId);
		
		logger.info(`Friend request sent from user ${requesterId} to user ${addresseeId}`);

		return FriendRequestDTO.fromFriendRequest(friendRequest, requester || undefined, addressee);
	}

	/**
	 * Respond to a friend request (accept or reject)
	 */
	async respondToFriendRequest(requestId: number, userId: number, accept: boolean): Promise<FriendRequestDTO> {
		const friendRequest = await FriendRequest.findByPk(requestId);

		if (!friendRequest) {
			throw ApiError.errorByType('FRIEND_REQUEST_NOT_FOUND');
		}

		// Check if user is the addressee of the request
		if (friendRequest.addresseeId !== userId) {
			throw ApiError.errorByType('NOT_REQUEST_PARTICIPANT');
		}

		// Check if request is still pending
		if (friendRequest.status !== FriendRequestStatus.PENDING) {
			throw ApiError.errorByType('REQUEST_ALREADY_RESPONDED');
		}

		const transaction = await sequelize.transaction();

		try {
			// Update request status
			const newStatus = accept ? FriendRequestStatus.ACCEPTED : FriendRequestStatus.REJECTED;
			await friendRequest.update(
				{
					status: newStatus,
					respondedAt: new Date(),
				},
				{ transaction }
			);

			// If accepted, create friendship
			if (accept) {
				const user1Id = Math.min(friendRequest.requesterId, friendRequest.addresseeId);
				const user2Id = Math.max(friendRequest.requesterId, friendRequest.addresseeId);

				await Friends.create(
					{
						user1Id,
						user2Id,
					},
					{ transaction }
				);

				logger.info(`Users ${friendRequest.requesterId} and ${friendRequest.addresseeId} are now friends`);
			}

			await transaction.commit();

			const [requester, addressee] = await Promise.all([
				User.findByPk(friendRequest.requesterId),
				User.findByPk(friendRequest.addresseeId),
			]);

			return FriendRequestDTO.fromFriendRequest(
				friendRequest,
				requester || undefined,
				addressee || undefined
			);
		} catch (error) {
			await transaction.rollback();
			logger.error('Error responding to friend request:', error);
			throw error;
		}
	}

	/**
	 * Cancel a friend request (by requester)
	 */
	async cancelFriendRequest(requestId: number, userId: number): Promise<void> {
		const friendRequest = await FriendRequest.findByPk(requestId);

		if (!friendRequest) {
			throw ApiError.errorByType('FRIEND_REQUEST_NOT_FOUND');
		}

		// Check if user is the requester
		if (friendRequest.requesterId !== userId) {
			throw ApiError.errorByType('NOT_REQUEST_PARTICIPANT');
		}

		// Check if request is still pending
		if (friendRequest.status !== FriendRequestStatus.PENDING) {
			throw ApiError.errorByType('REQUEST_ALREADY_RESPONDED');
		}

		await friendRequest.update({
			status: FriendRequestStatus.CANCELED,
			respondedAt: new Date(),
		});

		logger.info(`Friend request ${requestId} canceled by user ${userId}`);
	}

	/**
	 * Get incoming friend requests (requests sent to the user)
	 */
	async getIncomingRequests(userId: number): Promise<FriendRequestDTO[]> {
		const requests = await FriendRequest.findAll({
			where: {
				addresseeId: userId,
				status: FriendRequestStatus.PENDING,
			},
			order: [['createdAt', 'DESC']],
		});

		const requestsWithUsers = await Promise.all(
			requests.map(async (request) => {
				const requester = await User.findByPk(request.requesterId);
				return FriendRequestDTO.fromFriendRequest(request, requester || undefined, undefined);
			})
		);

		return requestsWithUsers;
	}

	/**
	 * Get outgoing friend requests (requests sent by the user)
	 */
	async getOutgoingRequests(userId: number): Promise<FriendRequestDTO[]> {
		const requests = await FriendRequest.findAll({
			where: {
				requesterId: userId,
				status: FriendRequestStatus.PENDING,
			},
			order: [['createdAt', 'DESC']],
		});

		const requestsWithUsers = await Promise.all(
			requests.map(async (request) => {
				const addressee = await User.findByPk(request.addresseeId);
				return FriendRequestDTO.fromFriendRequest(request, undefined, addressee || undefined);
			})
		);

		return requestsWithUsers;
	}

	/**
	 * Get list of friends
	 */
	async getFriends(userId: number): Promise<FriendDTO[]> {
		const friendships = await Friends.findAll({
			where: {
				[Op.or]: [
					{ user1Id: userId },
					{ user2Id: userId }
				]
			},
			order: [['createdAt', 'DESC']],
		});

		const friends = await Promise.all(
			friendships.map(async (friendship) => {
				const friendId = friendship.user1Id === userId ? friendship.user2Id : friendship.user1Id;
				const friend = await User.findByPk(friendId);

				if (!friend) {
					return null;
				}

				return new FriendDTO(
					friend.id,
					friend.username,
					friend.firstName,
					friend.lastName,
					friend.photoUrl,
					friend.stars,
					friend.exp,
					friendship.createdAt
				);
			})
		);

		return friends.filter((f): f is FriendDTO => f !== null);
	}

	/**
	 * Remove a friend
	 */
	async removeFriend(userId: number, friendId: number): Promise<void> {
		const user1Id = Math.min(userId, friendId);
		const user2Id = Math.max(userId, friendId);

		const friendship = await Friends.findOne({
			where: {
				user1Id,
				user2Id,
			}
		});

		if (!friendship) {
			throw ApiError.errorByType('NOT_FOUND');
		}

		await friendship.destroy();

		logger.info(`Friendship removed between users ${userId} and ${friendId}`);
	}

	/**
	 * Check if two users are friends
	 */
	async checkIfFriends(user1Id: number, user2Id: number): Promise<boolean> {
		const minId = Math.min(user1Id, user2Id);
		const maxId = Math.max(user1Id, user2Id);

		const friendship = await Friends.findOne({
			where: {
				user1Id: minId,
				user2Id: maxId,
			}
		});

		return !!friendship;
	}

	/**
	 * Search users by username (excluding current user and existing friends)
	 */
	async searchUsers(userId: number, query: string, limit: number = 20): Promise<UserShortDTO[]> {
		// Get list of friend IDs
		const friendships = await Friends.findAll({
			where: {
				[Op.or]: [
					{ user1Id: userId },
					{ user2Id: userId }
				]
			}
		});

		const friendIds = friendships.map(f => 
			f.user1Id === userId ? f.user2Id : f.user1Id
		);

		// Search for users
		const users = await User.findAll({
			where: {
				id: {
					[Op.notIn]: [userId, ...friendIds]
				},
				username: {
					[Op.like]: `%${query}%`
				}
			},
			limit,
			order: [['username', 'ASC']],
		});

		return users.map(user => UserShortDTO.fromUser(user));
	}
}

export default new FriendService();
