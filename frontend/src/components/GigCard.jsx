import { Link } from "react-router-dom";

const GigCard = ({ gig }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
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

      <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Budget</p>
          <p className="text-2xl font-bold text-primary-600">${gig.budget}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Posted by</p>
          <p className="text-sm font-medium text-gray-800">
            {gig.ownerId?.name || "Unknown"}
          </p>
        </div>
      </div>

      <Link
        to={`/gig/${gig._id}`}
        className="block w-full text-center btn-primary"
      >
        View Details
      </Link>
    </div>
  );
};

export default GigCard;
