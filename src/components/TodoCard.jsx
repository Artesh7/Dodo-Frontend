import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function TodoCard({ todo }) {
  if (!todo) return null;

  return (
    <Link to={`/todo/${todo.id}`}>
      <div className="bg-white shadow-md rounded-2xl p-4 mb-4 hover:shadow-lg transition cursor-pointer">
        <h2 className="text-xl font-bold mb-2 truncate">{todo.title}</h2>
        <p className="text-gray-600 mb-2">{todo.description}</p>
        <p className="text-sm text-gray-500">
          Created At: {new Date(todo.createdAt).toLocaleDateString()}
        </p>
        <p
          className={`mt-2 font-semibold ${
            todo.isCompleted ? "text-green-500" : "text-red-500"
          }`}
        >
          {todo.isCompleted ? "Completed" : "Not completed"}
        </p>
      </div>
    </Link>
  );
}

TodoCard.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.string,
    isCompleted: PropTypes.bool,
  }),
};

export default TodoCard;
