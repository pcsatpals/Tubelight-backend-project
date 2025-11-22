import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteVideo,
  findAllVideos,
  getVideoById,
  publishOrAddAVideo,
  togglePublish,
  updateVideo,
} from "../controllers/video.controller.js";

const router = Router();
router.use(verifyJWT);

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

router
  .route("/:videoId")
  .get(getVideoById)
  .put(upload.single("thumbnail"), updateVideo)
  .delete(deleteVideo);

router.route("/toggle/publish/:videoId").patch(togglePublish);

export default router;
