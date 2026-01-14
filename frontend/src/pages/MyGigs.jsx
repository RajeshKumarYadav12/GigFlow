import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyGigs } from "../redux/gigsSlice";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const MyGigs = () => {
  const dispatch = useDispatch();
  const { myGigs, isLoading } = useSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(fetchMyGigs());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Posted Gigs</h1>
          <Link to="/create-gig" className="btn-primary">
            Post New Gig
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading your gigs...</p>
          </div>
        ) : myGigs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              You haven't posted any gigs yet
            </p>
            <Link to="/create-gig" className="btn-primary inline-block">
              Post Your First Gig
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myGigs.map((gig) => (
              <div
                key={gig._id}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {gig.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          gig.status === "open"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {gig.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {gig.description}
                    </p>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">Budget:</span>
                        <span className="ml-2 font-semibold text-primary-600">
                          ${gig.budget}
                        </span>
                      </div>
                      {gig.hiredFreelancerId && (
                        <div>
                          <span className="text-gray-500">Hired:</span>
                          <span className="ml-2 font-semibold text-gray-800">
                            {gig.hiredFreelancerId.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link to={`/gig/${gig._id}`} className="btn-primary ml-4">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigs;
