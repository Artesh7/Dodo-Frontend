import api from "./api";

const todoService = {
  // Henter (evt. filtrerede) todos
  getTodos: async (filter = "All") => {
    const response = await api.get(`/Todo?filter=${filter}`);
    return response.data;
  },

  // Opretter en ny todo
  createTodo: async (todoData) => {
    const response = await api.post("/Todo/create", todoData);
    return response.data;
  },

  // Hent én todo ved ID
  getTodoById: async (id) => {
    // fx GET /Todo?filter=Id&TodoId=<id>
    const response = await api.get(`/Todo?filter=Id&TodoId=${id}`);
    // Forventet at det returnerer enten et enkelt todo-objekt eller en lille liste
    return response.data; 
    // Om serveren returnerer [todo] eller { ...todo } skal du lige tilpasse
  },

  // Opdater en todo
  updateTodo: async (id, updatedData) => {
    // PUT /Todo/<id>
    const response = await api.put(`/Todo/${id}`, updatedData);
    return response.data;
  },

  // Slet en todo
  deleteTodo: async (id) => {
    // DELETE /Todo/<id>
    const response = await api.delete(`/Todo/${id}`);
    return response.data;
  },
};

export default todoService;
