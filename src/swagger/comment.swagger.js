/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         content:
 *           type: string
 *         video:
 *           type: string
 *         owner:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/comments/{videoId}:
 *   get:
 *     summary: Get paginated comments for a video
 *     description: Fetch comments for a specific video with pagination support.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the video
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Number of comments per page
 *     responses:
 *       200:
 *         description: Paginated list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 692192ec03e2f1a34e6d22cf
 *                       content:
 *                         type: string
 *                         example: This video is created just for a testing purpose
 *                       video:
 *                         type: string
 *                         example: 6912125b3f55fd82ce7fe3b5
 *                       commentor:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 690c69c2005d030aff9f24c4
 *                           username:
 *                             type: string
 *                             example: satpal
 *                           fullName:
 *                             type: string
 *                             example: Satpal Singh
 *                           avatar:
 *                             type: string
 *                             example: http://res.cloudinary.com/...
 *                 totalDocs:
 *                   type: integer
 *                   example: 12
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *                 pagingCounter:
 *                   type: integer
 *                   example: 1
 *                 hasPrevPage:
 *                   type: boolean
 *                   example: false
 *                 hasNextPage:
 *                   type: boolean
 *                   example: true
 *                 prevPage:
 *                   type: integer
 *                   nullable: true
 *                   example: null
 *                 nextPage:
 *                   type: integer
 *                   nullable: true
 *                   example: 2
 *       400:
 *         description: Invalid Video Id
 *       500:
 *         description: Server error
 *   post:
 *     summary: Add a new comment to a video
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 */

/**
 * @swagger
 * /api/v1/comments/{commentId}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
