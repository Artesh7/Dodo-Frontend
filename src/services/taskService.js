// taskService.js
import api from "./api";

const taskService = {
  createTask: async (todoId, taskData) => {
    // taskData kan fx være { description: "xxx", isCompleted: false }
    const response = await api.post(`/Tasks/create?todoId=${todoId}`, taskData);
    return response.data;
  },
};

export default taskService;
