import { Router } from "express";
import {
  addVideoInPlayList,
  createPlayList,
  deletePlayList,
  getAllPlaylists,
  getPlaylistByPlaylistID,
  getUserPlaylists,
  removeVideoFromPlayList,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/").post(createPlayList).get(getAllPlaylists);
router.route("/user/:userId").get(getUserPlaylists);
router
  .route("/:playlistId")
  .get(getPlaylistByPlaylistID)
  .delete(deletePlayList);
router.route("/add-video").post(addVideoInPlayList);
router
  .route("/remove-video/:playListId/:videoId")
  .delete(removeVideoFromPlayList);

export default router;
