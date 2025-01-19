import "react";
import Card from "./Card";


const HomeCards = () => {
  return (
    // <!-- Developers and Employers -->
    <section className="py-4">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <Card>
          <h2 className="text-2xl font-bold">For Admin</h2>
            <p className="mt-2 mb-4">
              Create your todo list and keep track of your tasks
            </p>
            <a
              href="/jobs.html"
              className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
            >
              Browse Jobs
            </a>
            </Card>
            <Card bg="bg-indigo-100">
            <h2 className="text-2xl font-bold">For Childs</h2>
            <p className="mt-2 mb-4">
              Add your todo list and keep track of your tasks
            </p>
            <a
              href="/add-job.html"
              className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600"
            >
              Add Job
            </a>
            </Card>
        </div>
      </div>
    </section>
  );
};

export default HomeCards;
