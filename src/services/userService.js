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
};

export default userService;
