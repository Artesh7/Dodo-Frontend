import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import todoService from "../services/todoService";
import taskService from "../services/taskService";

function TodoDetails() {
  const { id } = useParams(); // /todo/:id
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lokale states til redigering af todo
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  // En kopi af tasks i "todo"
  const [tasks, setTasks] = useState([]);
  // Gemmer IDs på tasks, der er “slettes” ved Save
  const [deletedTaskIds, setDeletedTaskIds] = useState([]);

  // Hent todo med tasks
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        // getTodoById => GET /Todo?filter=Id&TodoId=<id>
        const response = await todoService.getTodoById(id);

        // Serveren kan returnere enten et object eller en liste [todo].
        // Juster alt efter, hvad din server sender.
        const singleTodo = Array.isArray(response) ? response[0] : response;

        setTodo(singleTodo);
        setEditTitle(singleTodo.title);
        setEditDescription(singleTodo.description);
        setTasks(singleTodo.tasks || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch todo by id:", err);
        setError("Could not load todo.");
        setLoading(false);
      }
    };
    fetchTodo();
  }, [id]);

  // Hvis vi vil ændre en task
  const handleTaskChange = (index, field, value) => {
    const updated = [...tasks];
    updated[index][field] = value;
    setTasks(updated);
  };

  // Sæt en task til sletning
  const handleDeleteTaskInUI = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setDeletedTaskIds((prev) => [...prev, taskId]);
  };

  // Klik på "Save" => opdater todo + tasks
  const handleSave = async () => {
    try {
      // 1) Opdater selve todo
      if (editTitle !== todo.title || editDescription !== todo.description) {
        await todoService.updateTodo(todo.id, {
          title: editTitle,
          description: editDescription,
        });
      }

      // 2) Opdater tasks
      for (const t of tasks) {
        if (t.id) {
          await taskService.updateTask(t.id, {
            description: t.description,
            isCompleted: t.isCompleted,
          });
        } else {
          // Evt. opret ny task, hvis man tillader at lave nye tasks her
          // fx:
          // await taskService.createTask(todo.id, {
          //   description: t.description,
          //   isCompleted: t.isCompleted
          // });
        }
      }

      // 3) Slet tasks
      for (const delId of deletedTaskIds) {
        await taskService.deleteTask(delId);
      }

      // Gå tilbage til /todos (eller forbliv på siden)
      navigate("/todos");
    } catch (err) {
      console.error("Failed to save updates:", err);
      setError("Could not save changes.");
    }
  };

  // Slet hele todo
  const handleDeleteTodo = async () => {
    if (!todo) return;
    try {
      await todoService.deleteTodo(todo.id);
      navigate("/todos");
    } catch (err) {
      console.error("Failed to delete todo:", err);
      setError("Could not delete todo.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!todo) return <div className="p-4">Todo not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo Details</h1>
        <button
          onClick={handleDeleteTodo}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete Todo
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Title</label>
        <input
          className="border rounded w-full p-2"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Description</label>
        <textarea
          className="border rounded w-full p-2"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />
      </div>

      <h2 className="text-lg font-bold mb-2">Tasks</h2>
      {tasks.length === 0 && <p className="text-gray-500">No tasks</p>}
      {tasks.map((task, index) => (
        <div key={task.id ?? index} className="border p-2 rounded mb-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 border rounded p-1"
              value={task.description}
              onChange={(e) =>
                handleTaskChange(index, "description", e.target.value)
              }
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-1"
                checked={task.isCompleted}
                onChange={(e) =>
                  handleTaskChange(index, "isCompleted", e.target.checked)
                }
              />
              <span>Completed</span>
            </label>
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => handleDeleteTaskInUI(task.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete Task
            </button>
          </div>
        </div>
      ))}

      {/* Gem alle ændringer */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default TodoDetails;
