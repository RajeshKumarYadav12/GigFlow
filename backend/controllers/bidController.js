import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import { notifyHired } from "../sockets/socketHandler.js";

export const createBid = async (req, res, next) => {
  try {
    const { gigId, message, proposedPrice } = req.body;

    if (!gigId || !message || proposedPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide gigId, message, and proposedPrice",
      });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: "Gig not found" });
    }

    if (gig.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This gig is no longer accepting bids",
      });
    }

    if (gig.ownerId.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot bid on your own gig",
      });
    }

    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user.id });
    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a bid for this gig",
      });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id,
      message,
      proposedPrice,
    });
    await bid.populate("freelancerId", "name email");

    res
      .status(201)
      .json({ success: true, message: "Bid submitted successfully", bid });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a bid for this gig",
      });
    }
    next(error);
  }
};

export const getBidsForGig = async (req, res, next) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the gig owner can view bids",
      });
    }

    const bids = await Bid.find({ gigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bids.length, bids });
  } catch (error) {
    next(error);
  }
};

export const getMyBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id })
      .populate("gigId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bids.length, bids });
  } catch (error) {
    next(error);
  }
};

export const hireBid = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { bidId } = req.params;
    const bid = await Bid.findById(bidId).populate("gigId").session(session);

    if (!bid) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Bid not found" });
    }

    const gig = bid.gigId;

    if (gig.ownerId.toString() !== req.user.id) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Only the gig owner can hire a freelancer",
      });
    }

    if (gig.status !== "open") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "This gig has already been assigned",
      });
    }

    await Bid.findByIdAndUpdate(
      bidId,
      { status: "hired" },
      { session, new: true }
    );

    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bidId } },
      { status: "rejected" },
      { session }
    );

    await Gig.findByIdAndUpdate(
      gig._id,
      { status: "assigned", hiredFreelancerId: bid.freelancerId },
      { session, new: true }
    );

    await session.commitTransaction();

    const updatedBid = await Bid.findById(bidId)
      .populate("freelancerId", "name email")
      .populate("gigId");

    try {
      notifyHired(bid.freelancerId.toString(), {
        _id: gig._id,
        title: gig.title,
      });
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
    }

    res.status(200).json({
      success: true,
      message: "Freelancer hired successfully",
      bid: updatedBid,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Hiring transaction failed:", error);

    res.status(500).json({
      success: false,
      message: "Failed to hire freelancer. Please try again.",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
