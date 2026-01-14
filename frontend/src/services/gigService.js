import api from "./api";

const gigService = {
  getGigs: async (searchTerm = "") => {
    const url = searchTerm
      ? `/gigs?search=${encodeURIComponent(searchTerm)}`
      : "/gigs";
    const response = await api.get(url);
    return response.data;
  },

  getGigById: async (gigId) => {
    const response = await api.get(`/gigs/${gigId}`);
    return response.data;
  },

  createGig: async (gigData) => {
    const response = await api.post("/gigs", gigData);
    return response.data;
  },

  getMyGigs: async () => {
    const response = await api.get("/gigs/my/posted");
    return response.data;
  },

  updateGig: async (gigId, gigData) => {
    const response = await api.put(`/gigs/${gigId}`, gigData);
    return response.data;
  },

  // Delete a gig
  deleteGig: async (gigId) => {
    const response = await axios.delete(`${API_URL}/${gigId}`);
    return response.data;
  },
};

export default gigService;
