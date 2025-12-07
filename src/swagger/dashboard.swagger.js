/**
 * @swagger
 * tags:
 *   name: Channel Dashboard
 *   description: Routes for channel analytics & creator dashboard
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ChannelStats:
 *       type: object
 *       properties:
 *         totalVideos:
 *           type: number
 *         totalViews:
 *           type: number
 *         totalLikes:
 *           type: number
 *         totalSubscribers:
 *           type: number
 *         totalComments:
 *           type: number
 *         watchTime:
 *           type: number
 *           description: Total minutes/hours watched
 *
 *     ChannelVideo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         thumbnail:
 *           type: string
 *         videoFile:
 *           type: string
 *         isPublished:
 *           type: boolean
 *         views:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/dashboard/stats:
 *   get:
 *     summary: Get channel statistics
 *     description: Fetch complete statistics for the authenticated creator (total views, subscribers, videos, comments, etc.).
 *     tags: [Channel Dashboard]
 *     responses:
 *       200:
 *         description: Successfully fetched channel statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChannelStats'
 *       401:
 *         description: Unauthorized — missing/invalid token
 */

/**
 * @swagger
 * /api/v1/dashboard/videos:
 *   get:
 *     summary: Get all videos of the creator
 *     description: Returns all videos uploaded by the logged-in user.
 *     tags: [Channel Dashboard]
 *     responses:
 *       200:
 *         description: Successfully fetched channel videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChannelVideo'
 *       401:
 *         description: Unauthorized — missing/invalid token
 */
