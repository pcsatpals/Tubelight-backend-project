import { Router } from "express";
import { createPlayList } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(createPlayList);

router.use(verifyJWT);

export default router;
