import express from 'express';
import friendController from '../controllers/friend.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Friends
 *     description: Friend management and social features
 * 
 * components:
 *   schemas:
 *     UserShortDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         username:
 *           type: string
 *           example: john_doe
 *         firstName:
 *           type: string
 *           nullable: true
 *           example: John
 *         lastName:
 *           type: string
 *           nullable: true
 *           example: Doe
 *         photoUrl:
 *           type: string
 *           nullable: true
 *           example: https://example.com/photo.jpg
 *         stars:
 *           type: number
 *           example: 150
 *         exp:
 *           type: number
 *           example: 500
 *     
 *     FriendDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/UserShortDTO'
 *         - type: object
 *           properties:
 *             friendsSince:
 *               type: string
 *               format: date-time
 *               example: 2024-01-15T10:30:00.000Z
 *     
 *     FriendRequestDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 1
 *         requesterId:
 *           type: number
 *           example: 1
 *         addresseeId:
 *           type: number
 *           example: 2
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED, CANCELED]
 *           example: PENDING
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00.000Z
 *         respondedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *         requester:
 *           $ref: '#/components/schemas/UserShortDTO'
 *         addressee:
 *           $ref: '#/components/schemas/UserShortDTO'
 */

/**
 * @openapi
 * /api/friends:
 *   get:
 *     tags:
 *       - Friends
 *     summary: Get list of friends
 *     description: Returns the list of all friends for the authenticated user
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: List of friends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendDTO'
 *       401:
 *         description: Unauthorized - invalid or missing access token
 */
router.get('/', authMiddleware, friendController.getFriends);

/**
 * @openapi
 * /api/friends/search:
 *   get:
 *     tags:
 *       - Friends
 *     summary: Search for users
 *     description: Search for users by username (excluding current user and existing friends)
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for username
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserShortDTO'
 *       400:
 *         description: Bad request - missing or invalid query parameter
 *       401:
 *         description: Unauthorized - invalid or missing access token
 */
router.get('/search', authMiddleware, friendController.searchUsers);

/**
 * @openapi
 * /api/friends/requests/incoming:
 *   get:
 *     tags:
 *       - Friends
 *     summary: Get incoming friend requests
 *     description: Returns all pending friend requests received by the authenticated user
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Incoming friend requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendRequestDTO'
 *       401:
 *         description: Unauthorized - invalid or missing access token
 */
router.get('/requests/incoming', authMiddleware, friendController.getIncomingRequests);

/**
 * @openapi
 * /api/friends/requests/outgoing:
 *   get:
 *     tags:
 *       - Friends
 *     summary: Get outgoing friend requests
 *     description: Returns all pending friend requests sent by the authenticated user
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Outgoing friend requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FriendRequestDTO'
 *       401:
 *         description: Unauthorized - invalid or missing access token
 */
router.get('/requests/outgoing', authMiddleware, friendController.getOutgoingRequests);

/**
 * @openapi
 * /api/friends/requests:
 *   post:
 *     tags:
 *       - Friends
 *     summary: Send a friend request
 *     description: Sends a friend request to another user
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendFriendRequestInput'
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FriendRequestDTO'
 *       400:
 *         description: Bad request - invalid input or friend request already exists
 *       401:
 *         description: Unauthorized - invalid or missing access token
 *       404:
 *         description: User not found
 */
router.post('/requests', authMiddleware, friendController.sendRequest);

/**
 * @openapi
 * /api/friends/requests/{requestId}/respond:
 *   post:
 *     tags:
 *       - Friends
 *     summary: Respond to a friend request
 *     description: Accept or reject a friend request
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the friend request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RespondToFriendRequestInput'
 *     responses:
 *       200:
 *         description: Friend request responded to successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FriendRequestDTO'
 *       400:
 *         description: Bad request - invalid input or request already responded
 *       401:
 *         description: Unauthorized - invalid or missing access token
 *       403:
 *         description: Forbidden - you are not the recipient of this request
 *       404:
 *         description: Friend request not found
 */
router.post('/requests/:requestId/respond', authMiddleware, friendController.respondToRequest);

/**
 * @openapi
 * /api/friends/requests/{requestId}/cancel:
 *   delete:
 *     tags:
 *       - Friends
 *     summary: Cancel a friend request
 *     description: Cancel a pending friend request that you sent
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the friend request to cancel
 *     responses:
 *       200:
 *         description: Friend request canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friend request canceled
 *       400:
 *         description: Bad request - request already responded
 *       401:
 *         description: Unauthorized - invalid or missing access token
 *       403:
 *         description: Forbidden - you did not send this request
 *       404:
 *         description: Friend request not found
 */
router.delete('/requests/:requestId/cancel', authMiddleware, friendController.cancelRequest);

/**
 * @openapi
 * /api/friends/{friendId}:
 *   delete:
 *     tags:
 *       - Friends
 *     summary: Remove a friend
 *     description: Remove a user from your friends list
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the friend to remove
 *     responses:
 *       200:
 *         description: Friend removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friend removed
 *       401:
 *         description: Unauthorized - invalid or missing access token
 *       404:
 *         description: Friendship not found
 */
router.delete('/:friendId', authMiddleware, friendController.removeFriend);

export default router;
