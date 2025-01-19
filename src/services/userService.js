import api from "./api";

const userService = {
  getChildren: async () => {
    try {
      const response = await api.get("/Child/all");
      return response.data.children.childs;
    } catch (error) {
      console.error("Failed to fetch children:", error);
      throw error;
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get("/User/profile");
      return response.data.profile;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  },

  // Ny metode til at oprette bruger
  createUser: async (userData) => {
    try {
      const response = await api.post("/User/create", userData);
      return response.data; // typisk status
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  },
};

export default userService;
