import api from "./api";

const taskService = {
  // Opret ny task til en todo
  createTask: async (todoId, taskData) => {
    const response = await api.post(`/Tasks/create?todoId=${todoId}`, taskData);
    return response.data;
  },

  // Opdater en task
  updateTask: async (taskId, taskData) => {
    // PUT /Tasks/<taskId>
    const response = await api.put(`/Tasks/${taskId}`, taskData);
    return response.data;
  },

  // Slet en task
  deleteTask: async (taskId) => {
    // DELETE /Tasks/<taskId>
    const response = await api.delete(`/Tasks/${taskId}`);
    return response.data;
  },
};

export default taskService;
