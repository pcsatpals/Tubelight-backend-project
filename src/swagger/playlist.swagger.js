/**
 * @swagger
 * tags:
 *   name: Playlist
 *   description: Playlist management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         owner:
 *           type: string
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *             description: Video IDs
 */

/**
 * @swagger
 * /api/v1/playlist:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Playlist
 *               description:
 *                 type: string
 *                 example: All my favorite videos
 *     responses:
 *       201:
 *         description: Playlist created successfully
 */

/**
 * @swagger
 * /api/v1/playlist/user/{userId}:
 *   get:
 *     summary: Get all playlists of a user
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of playlists for the user
 */

/**
 * @swagger
 * /api/v1/playlist/{playlistId}:
 *   get:
 *     summary: Get a playlist by ID
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist fetched successfully
 *
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
 */

/**
 * @swagger
 * /api/v1/playlist/add-video:
 *   post:
 *     summary: Add a video to a playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playlistId:
 *                 type: string
 *               videoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Video added to playlist
 */

/**
 * @swagger
 * /api/v1/playlist/remove-video/{playListId}/{videoId}:
 *   delete:
 *     summary: Remove a video from a playlist
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playListId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video removed from playlist
 */
