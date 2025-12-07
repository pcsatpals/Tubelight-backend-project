import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteVideo,
  fetchRandomizedVideos,
  findAllVideos,
  getVideoById,
  publishOrAddAVideo,
  togglePublish,
  updateVideo,
} from "../controllers/video.controller.js";

const router = Router();

/**
 * @swagger
 * /api/v1/video/random:
 *   get:
 *     summary: Get random videos
 *     tags: [Video]
 *     responses:
 *       200:
 *         description: List of random videos
 */
router.route("/random").get(fetchRandomizedVideos);

router.use(verifyJWT);

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
router
  .route("/")
  .get(findAllVideos)
  .post(
    upload.fields([
      {
        name: "video",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishOrAddAVideo
  );

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
router
  .route("/:videoId")
  .get(getVideoById)
  .put(upload.single("thumbnail"), updateVideo)
  .delete(deleteVideo);

router.route("/toggle/publish/:videoId").patch(togglePublish);

export default router;
