/**
 * @swagger
 * tags:
 *   name: Like
 *   description: APIs for liking videos and comments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LikeResponse:
 *       type: object
 *       properties:
 *         liked:
 *           type: boolean
 *           description: Whether the resource is now liked or unliked
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/like/toggle/video/{videoId}:
 *   post:
 *     summary: Toggle like/unlike on a video
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikeResponse'
 */

/**
 * @swagger
 * /api/v1/like/toggle/comment/{commentId}:
 *   post:
 *     summary: Toggle like/unlike on a comment
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment like status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LikeResponse'
 */

/**
 * @swagger
 * /api/v1/like/videos:
 *   get:
 *     summary: Get all liked videos of the logged-in user
 *     tags: [Like]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of liked videos
 */
