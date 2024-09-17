import express from "express";
import { acceptFriendRequest, getConnectionRequests, getUserConnections, rejectFriendRequest, removeConnection, sendRequest, getRecommendedFriends } from "../controllers/friendRequest.controller.js";
import protectedRoutes from "../middlewares/protectedRoutes.js"

const router = express.Router();

router.use(protectedRoutes);

router.post("/send/:id", sendRequest);
router.get("/", getConnectionRequests);
router.post("/accept/:id", acceptFriendRequest);
router.post("/reject/:id", rejectFriendRequest);
router.get("/friends", getUserConnections);
router.delete("/friend/:id", removeConnection);
router.get("/suggest", getRecommendedFriends);

export default router;