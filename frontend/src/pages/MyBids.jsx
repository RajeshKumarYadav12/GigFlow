import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBids } from "../redux/bidsSlice";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const MyBids = () => {
  const dispatch = useDispatch();
  const { myBids, isLoading } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyBids());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          My Submitted Bids
        </h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading your bids...</p>
          </div>
        ) : myBids.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              You haven't submitted any bids yet
            </p>
            <Link to="/" className="btn-primary inline-block">
              Browse Gigs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myBids.map((bid) => (
              <div
                key={bid._id}
                className={`card ${
                  bid.status === "hired"
                    ? "border-2 border-green-500"
                    : bid.status === "rejected"
                    ? "opacity-75"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {bid.gigId?.title || "Gig Title"}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                    <p className="text-gray-600 mb-3">{bid.message}</p>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">Your Price:</span>
                        <span className="ml-2 font-semibold text-primary-600">
                          ${bid.proposedPrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Gig Budget:</span>
                        <span className="ml-2 font-semibold text-gray-800">
                          ${bid.gigId?.budget || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Gig Status:</span>
                        <span className="ml-2 font-semibold text-gray-800 capitalize">
                          {bid.gigId?.status || "N/A"}
                        </span>
                      </div>
                    </div>

                    {bid.status === "hired" && (
                      <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-800 font-semibold">
                          🎉 Congratulations! You've been hired for this gig!
                        </p>
                      </div>
                    )}
                  </div>
                  {bid.gigId && (
                    <Link
                      to={`/gig/${bid.gigId._id}`}
                      className="btn-primary ml-4"
                    >
                      View Gig
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBids;
