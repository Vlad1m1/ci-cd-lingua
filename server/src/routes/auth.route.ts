import express from 'express';
import authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authenticate user via Telegram initData
 *     description: Authenticates a user using Telegram WebApp initData and returns access token. RefreshToken is set in httpOnly cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - initData
 *             properties:
 *               initData:
 *                 type: string
 *                 description: Telegram WebApp initialization data
 *                 example: query_id=AAHdF6IQAAAAAN0XohDhrOrc&user=%7B%22id%22%3A279058397...
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly cookie with refresh token
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Max-Age=2592000; Path=/; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponseDTO'
 *       400:
 *         description: Bad request - initData is missing
 *       401:
 *         description: Unauthorized - invalid initData
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     description: Generates a new access token using the refresh token from cookie. New refreshToken is also set in httpOnly cookie.
 *     responses:
 *       200:
 *         description: Successfully refreshed tokens
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly cookie with new refresh token
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Max-Age=2592000; Path=/; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponseDTO'
 *       401:
 *         description: Unauthorized - refresh token is missing or invalid
 */
router.post('/refresh', authController.refresh);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     description: Invalidates the refresh token and clears the cookie
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
router.post('/logout', authController.logout);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user profile
 *     description: Returns the profile of the currently authenticated user
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       401:
 *         description: Unauthorized - invalid or missing access token
 */
router.get('/me', authMiddleware, authController.getMe);

export default router;
