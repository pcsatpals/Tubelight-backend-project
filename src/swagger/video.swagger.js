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
 *     description: Fetch paginated list of videos with optional search, sorting, and filtering by user.
 *     tags: [Video]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of videos per page
 *
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search keyword for title, description, or video file
 *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *
 *       - in: query
 *         name: sortType
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter videos by owner (user ID)
 *
 *     responses:
 *       200:
 *         description: Videos fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Videos fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     docs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           thumbnail:
 *                             type: string
 *                           duration:
 *                             type: number
 *                           views:
 *                             type: number
 *                           isPublished:
 *                             type: boolean
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           channel:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               username:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                     totalDocs:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNextPage:
 *                       type: boolean
 *                     hasPrevPage:
 *                       type: boolean
 *
 *       500:
 *         description: Server error
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
