/**
 * @swagger
 * tags:
 *   name: Video
 *   description: Video API endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         videoFile:
 *           type: string
 *           description: URL of uploaded video
 *         thumbnail:
 *           type: string
 *           description: URL of thumbnail
 *         owner:
 *           type: string
 *         isPublished:
 *           type: boolean
 */

/**
 * @swagger
 * /api/v1/video/random:
 *   get:
 *     summary: Get randomized videos
 *     tags: [Video]
 *     responses:
 *       200:
 *         description: List of random videos
 */

/**
 * @swagger
 * /api/v1/video:
 *   get:
 *     summary: Get all videos
 *     tags: [Video]
 *     responses:
 *       200:
 *         description: All videos fetched successfully
 */

/**
 * @swagger
 * /api/v1/video:
 *   post:
 *     summary: Create / Upload a new video
 *     tags: [Video]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video created successfully
 */

/**
 * @swagger
 * /api/v1/video/{videoId}:
 *   get:
 *     summary: Get a video by ID
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *     responses:
 *       200:
 *         description: Video fetched successfully
 *
 *   put:
 *     summary: Update a video
 *     tags: [Video]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Video updated successfully
 *
 *   delete:
 *     summary: Delete a video
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *     responses:
 *       200:
 *         description: Video deleted successfully
 */

/**
 * @swagger
 * /api/v1/video/toggle/publish/{videoId}:
 *   patch:
 *     summary: Toggle publish/unpublish a video
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *     responses:
 *       200:
 *         description: Video publish state toggled
 */
