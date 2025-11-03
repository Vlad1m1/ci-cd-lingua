import type { FriendRequestStatus } from '../models/types/FriendRequestStatus';

export interface FriendRequestData {
	id: number;
	requesterId: number;
	addresseeId: number;
	status: FriendRequestStatus;
	createdAt: Date;
	respondedAt: Date | null;
	requester?: {
		id: number;
		username: string;
		firstName: string | null;
		lastName: string | null;
		photoUrl: string | null;
		stars: number;
		exp: number;
	};
	addressee?: {
		id: number;
		username: string;
		firstName: string | null;
		lastName: string | null;
		photoUrl: string | null;
		stars: number;
		exp: number;
	};
}

export interface FriendData {
	id: number;
	username: string;
	firstName: string | null;
	lastName: string | null;
	photoUrl: string | null;
	stars: number;
	exp: number;
	friendsSince: Date;
}

export interface SendFriendRequestParams {
	requesterId: number;
	addresseeId: number;
}

export interface RespondToFriendRequestParams {
	requestId: number;
	userId: number;
	accept: boolean;
}

export interface GetFriendRequestsParams {
	userId: number;
	type: 'incoming' | 'outgoing';
}
