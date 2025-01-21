import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import todoService from "../services/todoService";
import taskService from "../services/taskService";

function TodoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deletedTaskIds, setDeletedTaskIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        const response = await todoService.getTodoById(id);
        const singleTodo = Array.isArray(response) ? response[0] : response;
        if (!singleTodo) {
          setError("No todo found");
          setLoading(false);
          return;
        }

        setTodo(singleTodo);
        setEditTitle(singleTodo.title);
        setEditDescription(singleTodo.description);
        setTasks(singleTodo.tasks || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch todo:", err);
        setError("Could not load todo.");
        setLoading(false);
      }
    };
    fetchTodo();
  }, [id]);

  // Slet hele todo
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    if (!todo) return;
    try {
      await todoService.deleteTodo(todo.id);
      navigate("/todos");
    } catch (err) {
      console.error("Failed to delete todo:", err);
      setError("Could not delete todo.");
    }
  };

  // Slet en task (confirm)
  const handleDeleteTaskClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteTaskConfirm(true);
  };
  const handleCancelDeleteTask = () => {
    setTaskToDelete(null);
    setShowDeleteTaskConfirm(false);
  };
  const handleConfirmDeleteTask = () => {
    if (!taskToDelete) return;
    setShowDeleteTaskConfirm(false);

    // Fjern task fra tasks-liste
    setTasks((prev) => prev.filter((t) => t !== taskToDelete));

    // Hvis task har et id, tilføj til slettelisten
    if (taskToDelete.id) {
      setDeletedTaskIds((prev) => [...prev, taskToDelete.id]);
    }
    setTaskToDelete(null);
  };

  // Tilføj en ny tom task
  const handleAddTask = () => {
    setTasks((prev) => [...prev, { description: "", isCompleted: false }]);
  };

  // Cancel => naviger tilbage til /todos
  const handleCancelChanges = () => {
    navigate("/todos");
  };

  // Save => opdater, slet + opret tasks
  const handleSave = async () => {
    if (!todo) return;
    try {
      // Opdater todo
      if (
        editTitle !== todo.title ||
        editDescription !== todo.description
      ) {
        await todoService.updateTodo(todo.id, {
          title: editTitle,
          description: editDescription,
        });
      }

      // Opdater eller opret tasks
      for (const t of tasks) {
        if (t.id) {
          await taskService.updateTask(t.id, {
            description: t.description,
            isCompleted: t.isCompleted,
          });
        } else {
          // Opret ny task, hvis der er en beskrivelse
          if (t.description.trim()) {
            await taskService.createTask(todo.id, {
              description: t.description,
              isCompleted: t.isCompleted,
            });
          }
        }
      }

      // Slet tasks
      for (const delId of deletedTaskIds) {
        await taskService.deleteTask(delId);
      }

      navigate("/todos");
    } catch (err) {
      console.error("Failed to save changes:", err);
      setError("Could not save changes.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!todo) return <div>Todo not found...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo Details</h1>
        <button
          onClick={handleDeleteClick}
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
      {tasks.length === 0 && <p>No tasks</p>}
      {tasks.map((task, index) => (
        <div key={task.id ?? index} className="border p-2 rounded mb-2">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2 flex-1">
              <input
                type="text"
                className="flex-1 border rounded p-1"
                value={task.description}
                onChange={(e) => {
                  const updated = [...tasks];
                  updated[index].description = e.target.value;
                  setTasks(updated);
                }}
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={task.isCompleted}
                  onChange={(e) => {
                    const updated = [...tasks];
                    updated[index].isCompleted = e.target.checked;
                    setTasks(updated);
                  }}
                />
                <span>Completed</span>
              </label>
            </div>
            <button
              onClick={() => handleDeleteTaskClick(task)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={handleAddTask}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        + Add Task
      </button>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={handleCancelChanges}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Save
        </button>
      </div>

      {/* Delete Todo Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-lg z-10 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">
              You are about to delete this todo!
            </h2>
            <p className="mb-4">Are you sure?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Modal */}
      {showDeleteTaskConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
          <div className="bg-white p-6 rounded shadow-lg z-10 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">
              You are about to delete this task!
            </h2>
            <p className="mb-4">Are you sure?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDeleteTask}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteTask}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoDetails;
