import Gig from "../models/Gig.js";

export const getGigs = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = { status: "open" };

    if (search && search.trim()) {
      query.$text = { $search: search };
    }

    const gigs = await Gig.find(query)
      .populate("ownerId", "name email")
      .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, count: gigs.length, gigs });
  } catch (error) {
    next(error);
  }
};

export const getGigById = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate("ownerId", "name email")
      .populate("hiredFreelancerId", "name email");

    if (!gig) {
      return res.status(404).json({ success: false, message: "Gig not found" });
    }

    res.status(200).json({ success: true, gig });
  } catch (error) {
    next(error);
  }
};

export const createGig = async (req, res, next) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || budget === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, and budget",
      });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id,
    });

    await gig.populate("ownerId", "name email");

    res.status(201).json({
      success: true,
      message: "Gig created successfully",
      gig,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPostedGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user.id })
      .populate("hiredFreelancerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: gigs.length, gigs });
  } catch (error) {
    next(error);
  }
};

export const updateGig = async (req, res, next) => {
  try {
    let gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ success: false, message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this gig",
      });
    }

    if (gig.status === "assigned") {
      return res.status(400).json({
        success: false,
        message: "Cannot update an assigned gig",
      });
    }

    const { title, description, budget } = req.body;

    gig = await Gig.findByIdAndUpdate(
      req.params.id,
      { title, description, budget },
      { new: true, runValidators: true }
    ).populate("ownerId", "name email");

    res.status(200).json({
      success: true,
      message: "Gig updated successfully",
      gig,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/gigs/:id
 * @desc    Delete a gig
 * @access  Private (Owner only)
 */
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ success: false, message: "Gig not found" });
    }

    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this gig",
      });
    }

    if (gig.status === "assigned") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an assigned gig",
      });
    }

    await gig.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Gig deleted successfully" });
  } catch (error) {
    next(error);
  }
};
