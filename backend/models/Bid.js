import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: [true, "Bid must be associated with a gig"],
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Bid must have a freelancer"],
    },
    message: {
      type: String,
      required: [true, "Please provide a message"],
      trim: true,
      maxlength: [500, "Message cannot be more than 500 characters"],
    },
    proposedPrice: {
      type: Number,
      required: [true, "Please provide a proposed price"],
      min: [0, "Proposed price must be a positive number"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "hired", "rejected"],
        message: "Status must be pending, hired, or rejected",
      },
      default: "pending",
    },
  },
  { timestamps: true }
);

bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });
bidSchema.index({ gigId: 1, status: 1 });
bidSchema.index({ freelancerId: 1 });

const Bid = mongoose.model("Bid", bidSchema);

export default Bid;
