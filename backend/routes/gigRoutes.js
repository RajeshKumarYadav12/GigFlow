import express from "express";
import {
  getGigs,
  getGigById,
  createGig,
  getMyPostedGigs,
  updateGig,
  deleteGig,
} from "../controllers/gigController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getGigs);
router.get("/:id", getGigById);
router.post("/", protect, createGig);
router.get("/my/posted", protect, getMyPostedGigs);
router.put("/:id", protect, updateGig);
router.delete("/:id", protect, deleteGig);

export default router;
