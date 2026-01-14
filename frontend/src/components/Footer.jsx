import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">GigFlow</h3>
            <p className="text-gray-400">
              Your trusted freelance marketplace for connecting talent with
              opportunities.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  Browse Gigs
                </Link>
              </li>
              <li>
                <Link
                  to="/my-gigs"
                  className="text-gray-400 hover:text-white transition"
                >
                  My Gigs
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bids"
                  className="text-gray-400 hover:text-white transition"
                >
                  My Bids
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">Help Center</li>
              <li className="text-gray-400">Terms of Service</li>
              <li className="text-gray-400">Privacy Policy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} GigFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
