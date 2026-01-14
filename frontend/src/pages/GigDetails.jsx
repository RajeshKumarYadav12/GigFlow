import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGigById } from "../redux/gigsSlice";
import { createBid, fetchBidsForGig, hireBid } from "../redux/bidsSlice";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const GigDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentGig, isLoading: gigLoading } = useSelector(
    (state) => state.gigs
  );
  const { bids, isLoading: bidLoading } = useSelector((state) => state.bids);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    message: "",
    proposedPrice: "",
  });

  const isOwner = user && currentGig && user.id === currentGig.ownerId?._id;
  const hasUserBid = bids.some((bid) => bid.freelancerId?._id === user?.id);

  useEffect(() => {
    dispatch(fetchGigById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (isOwner && currentGig) {
      dispatch(fetchBidsForGig(id));
    }
  }, [dispatch, id, isOwner, currentGig]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to submit a bid");
      navigate("/login");
      return;
    }

    if (!bidData.message || !bidData.proposedPrice) {
      toast.error("Please fill in all fields");
      return;
    }

    if (parseFloat(bidData.proposedPrice) <= 0) {
      toast.error("Proposed price must be greater than 0");
      return;
    }

    try {
      await dispatch(
        createBid({
          gigId: id,
          message: bidData.message,
          proposedPrice: parseFloat(bidData.proposedPrice),
        })
      ).unwrap();
      toast.success("Bid submitted successfully!");
      setShowBidForm(false);
      setBidData({ message: "", proposedPrice: "" });
    } catch (err) {
      toast.error(err || "Failed to submit bid");
    }
  };

  const handleHire = async (bidId) => {
    if (!window.confirm("Are you sure you want to hire this freelancer?")) {
      return;
    }

    try {
      await dispatch(hireBid(bidId)).unwrap();
      toast.success("Freelancer hired successfully!");
      dispatch(fetchGigById(id));
      dispatch(fetchBidsForGig(id));
    } catch (err) {
      toast.error(err || "Failed to hire freelancer");
    }
  };

  if (gigLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading gig...</p>
        </div>
      </div>
    );
  }

  if (!currentGig) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Gig not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Gig Details */}
          <div className="card mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {currentGig.title}
              </h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  currentGig.status === "open"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {currentGig.status}
              </span>
            </div>

            <p className="text-gray-600 mb-6 whitespace-pre-wrap">
              {currentGig.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Budget</p>
                <p className="text-2xl font-bold text-primary-600">
                  ${currentGig.budget}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Posted by</p>
                <p className="text-lg font-medium text-gray-800">
                  {currentGig.ownerId?.name}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="text-lg font-medium text-gray-800 capitalize">
                  {currentGig.status}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwner &&
              currentGig.status === "open" &&
              isAuthenticated &&
              !hasUserBid && (
                <button
                  onClick={() => setShowBidForm(!showBidForm)}
                  className="btn-primary w-full"
                >
                  {showBidForm ? "Cancel" : "Submit a Bid"}
                </button>
              )}

            {!isAuthenticated && currentGig.status === "open" && (
              <button
                onClick={() => navigate("/login")}
                className="btn-primary w-full"
              >
                Login to Submit a Bid
              </button>
            )}

            {hasUserBid && currentGig.status === "open" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                You have already submitted a bid for this gig.
              </div>
            )}
          </div>

          {/* Bid Form */}
          {showBidForm && (
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Submit Your Bid
              </h2>
              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Proposal
                  </label>
                  <textarea
                    value={bidData.message}
                    onChange={(e) =>
                      setBidData({ ...bidData, message: e.target.value })
                    }
                    rows="4"
                    className="input-field resize-none"
                    placeholder="Explain why you're the best fit for this gig..."
                    maxLength={500}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {bidData.message.length}/500 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Proposed Price ($)
                  </label>
                  <input
                    type="number"
                    value={bidData.proposedPrice}
                    onChange={(e) =>
                      setBidData({ ...bidData, proposedPrice: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter your price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={bidLoading}
                  className="btn-primary w-full"
                >
                  {bidLoading ? "Submitting..." : "Submit Bid"}
                </button>
              </form>
            </div>
          )}

          {/* Bids List (Owner Only) */}
          {isOwner && (
            <div className="card">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Bids Received ({bids.length})
              </h2>

              {bidLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : bids.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No bids received yet
                </p>
              ) : (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div
                      key={bid._id}
                      className={`border rounded-lg p-4 ${
                        bid.status === "hired"
                          ? "bg-green-50 border-green-300"
                          : bid.status === "rejected"
                          ? "bg-gray-50 border-gray-300"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {bid.freelancerId?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {bid.freelancerId?.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">
                            ${bid.proposedPrice}
                          </p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                              bid.status === "hired"
                                ? "bg-green-100 text-green-800"
                                : bid.status === "rejected"
                                ? "bg-gray-200 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {bid.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{bid.message}</p>

                      {bid.status === "pending" &&
                        currentGig.status === "open" && (
                          <button
                            onClick={() => handleHire(bid._id)}
                            disabled={bidLoading}
                            className="btn-primary"
                          >
                            Hire This Freelancer
                          </button>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
