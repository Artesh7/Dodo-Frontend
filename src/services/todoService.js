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

  createTodo: async (todoData) => {
    try {
      // todoData kan f.eks. være: { title, description, childId }
      const response = await api.post("/Todo/create", todoData);
      return response.data; // Forventet: { id: "...", ... }
    } catch (error) {
      console.error("Create Todo failed:", error);
      throw error;
    }
  },
};

export default todoService;
