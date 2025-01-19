import api from "./api";

const todoService = {
  getTodos: async (filter = "All") => {
    try {
      const response = await api.get(`/Todo?filter=${filter}`);
      return response.data;
    } catch (error) {
      console.error("Todo retrieval failed:", error);
      throw error;
    }
  },
};

export default todoService;
