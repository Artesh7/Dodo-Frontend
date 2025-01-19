import api from "./api.js";


const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/User/login", credentials);
      return response.data.token;
    } catch (error) {
      console.error("Login API call failed:", error);
      throw error;
    }
  },
};

export default authService;
