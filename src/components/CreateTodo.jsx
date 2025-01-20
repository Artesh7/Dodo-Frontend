import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import userService from "../services/userService";
import todoService from "../services/todoService";
import taskService from "../services/taskService";

function CreateTodo() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Her gemmer vi detaljer om den Todo, vi vil oprette
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [childId, setChildId] = useState("");

  // Her gemmer vi eventuel rolle fra profile
  const [role, setRole] = useState(null);
  // Liste over alle mulige "childs" (kun relevant for parent)
  const [children, setChildren] = useState([]);

  // En liste med tasks, der knyttes til todoen
  const [tasks, setTasks] = useState([
    // Eksempel på en enkelt "tom" task
    { description: "", isCompleted: false },
  ]);

  // Hent profil + childs, hvis man er parent
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.token) {
          // Hent rolle
          const profileData = await userService.getProfile();
          setRole(profileData.role);

          // Hvis rolle = parent => Hent liste over alle childs
          if (profileData.role?.toLowerCase() === "parent") {
            const childList = await userService.getChildren();
            // childList bør være et array af {id, userName, ...}
            setChildren(childList);
          }
        }
      } catch (error) {
        console.error("Fejl ved hentning af data:", error);
      }
    };
    fetchData();
  }, [auth.token]);

  // Funktion til at tilføje endnu et task-felt
  const handleAddTask = () => {
    setTasks((prev) => [...prev, { description: "", isCompleted: false }]);
  };

  // Håndtering af ændringer i tasks-felterne
  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  // Når vi trykker "Done": Opret todo, og derefter opret tasks
  const handleCreateTodo = async () => {
    try {
      // 1) Opret Todo
      //    Hvis man er child, undlades childId i body (eller send en tom str.).
      const todoBody = {
        title,
        description,
      };

      // Hvis man er parent, og childId IKKE er tom => Tilføj childId
      if (role?.toLowerCase() === "parent" && childId) {
        todoBody.childId = childId;
      }

      const createdTodo = await todoService.createTodo(todoBody);
      const newTodoId = createdTodo.id; // Forvent, at serveren returnerer { id: "some-guid", ... }

      // 2) Opret tasks (hvis tasks-arrayet har noget)
      // Bemærk: du kan også filtrere tomme tasks ud
      for (const task of tasks) {
        if (task.description.trim() !== "") {
          await taskService.createTask(newTodoId, {
            description: task.description,
            isCompleted: task.isCompleted,
          });
        }
      }

      // 3) Naviger tilbage til /todos
      navigate("/todos");
    } catch (err) {
      console.error("Fejl ved oprettelse af todo/tasks:", err);
    }
  };

  // Er brugeren child? => Ingen dropdown for childId
  const isChild = role?.toLowerCase() === "child";

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

      {/* Child dropdown (kun for parent) */}
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

      {/* Tasks - dynamisk liste */}
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
            <label className="mr-2">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={(e) =>
                  handleTaskChange(index, "isCompleted", e.target.checked)
                }
              />{" "}
              Completed
            </label>
          </div>
        ))}

        {/* Grøn plus-knap til at tilføje flere tasks */}
        <button
          type="button"
          onClick={handleAddTask}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          + Add Task
        </button>
      </div>

      {/* Done-knap => Opret todo + tasks */}
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
