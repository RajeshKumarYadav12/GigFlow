import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGig } from "../redux/gigsSlice";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.gigs);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.budget) {
      toast.error("Please fill in all fields");
      return;
    }

    if (parseFloat(formData.budget) <= 0) {
      toast.error("Budget must be greater than 0");
      return;
    }

    try {
      await dispatch(
        createGig({
          ...formData,
          budget: parseFloat(formData.budget),
        })
      ).unwrap();
      toast.success("Gig created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err || "Failed to create gig");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Post a New Gig
          </h1>

          <form onSubmit={handleSubmit} className="card space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Build a responsive website"
                maxLength={100}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="input-field resize-none"
                placeholder="Describe your project in detail..."
                maxLength={1000}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget ($)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="input-field"
                placeholder="500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1"
              >
                {isLoading ? "Creating..." : "Post Gig"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;
