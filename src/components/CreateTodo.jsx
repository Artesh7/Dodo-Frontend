import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import userService from "../services/userService";
import todoService from "../services/todoService";
import taskService from "../services/taskService";

function CreateTodo() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Felter til selve todo
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Hvis man er parent, kan man evt. tildele childId
  const [childId, setChildId] = useState("");
  const [role, setRole] = useState(null);
  const [children, setChildren] = useState([]);

  // Tasks-liste. Start evt. med 1 tom opgave
  const [tasks, setTasks] = useState([{ description: "", isCompleted: false }]);

  // Hent profil (rolle) + childs (hvis parent)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.token) {
          const profileData = await userService.getProfile();
          setRole(profileData.role);

          // Hvis parent, hent liste over child-brugere
          if (profileData.role?.toLowerCase() === "parent") {
            const childList = await userService.getChildren();
            setChildren(childList);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile or children:", error);
      }
    };
    fetchData();
  }, [auth.token]);

  // Tjek om bruger er child
  const isChild = role?.toLowerCase() === "child";

  // Tilføj endnu en tom task-linje
  const handleAddTask = () => {
    setTasks((prev) => [...prev, { description: "", isCompleted: false }]);
  };

  // Opdater et felt i en given task
  const handleTaskChange = (index, field, value) => {
    const updated = [...tasks];
    updated[index][field] = value;
    setTasks(updated);
  };

  // Håndter "Done" -> opret todo, opret tasks
  const handleCreateTodo = async () => {
    try {
      // 1) Opret selve todo
      const created = await todoService.createTodo({
        title,
        description,
        childId,
      });
      // created er fx { message: "...", todo: { id: "..." } }

      // 2) Tag ID fra created.todo.id
      const newTodoId = created.todo.id;

      // 3) Opret tasks med newTodoId
      for (const t of tasks) {
        if (t.description.trim()) {
          await taskService.createTask(newTodoId, {
            description: t.description,
            isCompleted: t.isCompleted,
          });
        }
      }

      navigate("/todos");
    } catch (error) {
      console.error("Failed to create todo + tasks:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow">
      <h1 className="text-2xl font-bold mb-4">Create Todo</h1>

      {/* Title */}
      <label className="block mb-2 font-semibold">Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {/* Description */}
      <label className="block mb-2 font-semibold">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {/* Assign Child (kun hvis parent) */}
      {!isChild && (
        <>
          <label className="block mb-2 font-semibold">
            Assign to Child (optional)
          </label>
          <select
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="">-- No child selected --</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.userName}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Tasks-section */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Tasks</h2>
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Task description"
              value={task.description}
              onChange={(e) =>
                handleTaskChange(index, "description", e.target.value)
              }
              className="flex-1 p-2 border border-gray-300 rounded mr-2"
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
        ))}

        {/* Grøn plus-knap -> tilføj ny tom task */}
        <button
          type="button"
          onClick={handleAddTask}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          + Add Task
        </button>
      </div>

      {/* Done-knap -> create todo + tasks */}
      <button
        onClick={handleCreateTodo}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Done
      </button>
    </div>
  );
}

export default CreateTodo;
