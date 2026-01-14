import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    budget: {
      type: Number,
      required: [true, "Please provide a budget"],
      min: [0, "Budget must be a positive number"],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Gig must have an owner"],
    },
    status: {
      type: String,
      enum: {
        values: ["open", "assigned"],
        message: "Status must be either open or assigned",
      },
      default: "open",
    },
    hiredFreelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

gigSchema.index({ status: 1, createdAt: -1 });
gigSchema.index({ ownerId: 1 });
gigSchema.index({ title: "text", description: "text" });

const Gig = mongoose.model("Gig", gigSchema);

export default Gig;
