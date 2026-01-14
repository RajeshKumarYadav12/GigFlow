import express from "express";
import {
  createBid,
  getBidsForGig,
  getMyBids,
  hireBid,
} from "../controllers/bidController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, createBid);
router.get("/my/submitted", protect, getMyBids);
router.get("/:gigId", protect, getBidsForGig);
router.patch("/:bidId/hire", protect, hireBid);

export default router;
