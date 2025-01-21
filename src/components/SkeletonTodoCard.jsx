function SkeletonTodoCard() {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-5 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

export default SkeletonTodoCard;
