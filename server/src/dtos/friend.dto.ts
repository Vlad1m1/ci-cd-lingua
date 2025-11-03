import type { FriendRequestStatus } from '../models/types/FriendRequestStatus';
import type { User } from '../models/entities/User';
import type { FriendRequest } from '../models/entities/FriendRequest';

/**
 * @openapi
 * components:
 *   schemas:
 *     UserShortDTO:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - stars
 *         - exp
 *       properties:
 *         id:
 *           type: integer
 *           description: User ID
 *           example: 1
 *         username:
 *           type: string
 *           description: Username
 *           example: john_doe
 *         firstName:
 *           type: string
 *           nullable: true
 *           description: User's first name
 *           example: John
 *         lastName:
 *           type: string
 *           nullable: true
 *           description: User's last name
 *           example: Doe
 *         photoUrl:
 *           type: string
 *           nullable: true
 *           description: URL to user's photo
 *           example: https://example.com/photo.jpg
 *         stars:
 *           type: integer
 *           description: Number of stars earned
 *           example: 100
 *         exp:
 *           type: integer
 *           description: Experience points
 *           example: 500
 */
export class UserShortDTO {
	id: number;
	username: string;
	firstName: string | null;
	lastName: string | null;
	photoUrl: string | null;
	stars: number;
	exp: number;

	constructor(
		id: number,
		username: string,
		firstName: string | null,
		lastName: string | null,
		photoUrl: string | null,
		stars: number,
		exp: number
	) {
		this.id = id;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.photoUrl = photoUrl;
		this.stars = stars;
		this.exp = exp;
	}

	static fromUser(user: User): UserShortDTO {
		return new UserShortDTO(
			user.id,
			user.username,
			user.firstName,
			user.lastName,
			user.photoUrl,
			user.stars,
			user.exp
		);
	}
}

/**
 * @openapi
 * components:
 *   schemas:
 *     FriendDTO:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - stars
 *         - exp
 *         - friendsSince
 *       properties:
 *         id:
 *           type: integer
 *           description: Friend's user ID
 *           example: 2
 *         username:
 *           type: string
 *           description: Friend's username
 *           example: jane_doe
 *         firstName:
 *           type: string
 *           nullable: true
 *           description: Friend's first name
 *           example: Jane
 *         lastName:
 *           type: string
 *           nullable: true
 *           description: Friend's last name
 *           example: Doe
 *         photoUrl:
 *           type: string
 *           nullable: true
 *           description: URL to friend's photo
 *           example: https://example.com/photo.jpg
 *         stars:
 *           type: integer
 *           description: Friend's stars count
 *           example: 50
 *         exp:
 *           type: integer
 *           description: Friend's experience points
 *           example: 200
 *         friendsSince:
 *           type: string
 *           format: date-time
 *           description: Date when friendship was established
 *           example: 2024-01-01T00:00:00.000Z
 */
export class FriendDTO {
	id: number;
	username: string;
	firstName: string | null;
	lastName: string | null;
	photoUrl: string | null;
	stars: number;
	exp: number;
	friendsSince: Date;

	constructor(
		id: number,
		username: string,
		firstName: string | null,
		lastName: string | null,
		photoUrl: string | null,
		stars: number,
		exp: number,
		friendsSince: Date
	) {
		this.id = id;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.photoUrl = photoUrl;
		this.stars = stars;
		this.exp = exp;
		this.friendsSince = friendsSince;
	}
}

/**
 * @openapi
 * components:
 *   schemas:
 *     FriendRequestDTO:
 *       type: object
 *       required:
 *         - id
 *         - requesterId
 *         - addresseeId
 *         - status
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *           description: Friend request ID
 *           example: 1
 *         requesterId:
 *           type: integer
 *           description: ID of user who sent the request
 *           example: 1
 *         addresseeId:
 *           type: integer
 *           description: ID of user who received the request
 *           example: 2
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED, CANCELED]
 *           description: Request status
 *           example: PENDING
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Request creation date
 *           example: 2024-01-01T00:00:00.000Z
 *         respondedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Response date (null if pending)
 *           example: null
 *         requester:
 *           $ref: '#/components/schemas/UserShortDTO'
 *         addressee:
 *           $ref: '#/components/schemas/UserShortDTO'
 */
export class FriendRequestDTO {
	id: number;
	requesterId: number;
	addresseeId: number;
	status: FriendRequestStatus;
	createdAt: Date;
	respondedAt: Date | null;
	requester?: UserShortDTO;
	addressee?: UserShortDTO;

	constructor(
		id: number,
		requesterId: number,
		addresseeId: number,
		status: FriendRequestStatus,
		createdAt: Date,
		respondedAt: Date | null,
		requester?: UserShortDTO,
		addressee?: UserShortDTO
	) {
		this.id = id;
		this.requesterId = requesterId;
		this.addresseeId = addresseeId;
		this.status = status;
		this.createdAt = createdAt;
		this.respondedAt = respondedAt;
		this.requester = requester;
		this.addressee = addressee;
	}

	static fromFriendRequest(
		friendRequest: FriendRequest,
		requester?: User,
		addressee?: User
	): FriendRequestDTO {
		return new FriendRequestDTO(
			friendRequest.id,
			friendRequest.requesterId,
			friendRequest.addresseeId,
			friendRequest.status,
			friendRequest.createdAt,
			friendRequest.respondedAt,
			requester ? UserShortDTO.fromUser(requester) : undefined,
			addressee ? UserShortDTO.fromUser(addressee) : undefined
		);
	}
}

/**
 * @openapi
 * components:
 *   schemas:
 *     SendFriendRequestInput:
 *       type: object
 *       required:
 *         - addresseeId
 *       properties:
 *         addresseeId:
 *           type: integer
 *           description: ID of the user to send friend request to
 *           example: 2
 */
export class SendFriendRequestDTO {
	addresseeId: number;

	constructor(addresseeId: number) {
		this.addresseeId = addresseeId;
	}
}

/**
 * @openapi
 * components:
 *   schemas:
 *     RespondToFriendRequestInput:
 *       type: object
 *       required:
 *         - accept
 *       properties:
 *         accept:
 *           type: boolean
 *           description: Whether to accept (true) or reject (false) the request
 *           example: true
 */
export class RespondToFriendRequestDTO {
	accept: boolean;

	constructor(accept: boolean) {
		this.accept = accept;
	}
}
