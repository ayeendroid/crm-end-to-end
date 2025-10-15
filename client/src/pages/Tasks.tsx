import React from "react";

const Tasks: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            🔧 Field Technician Tasks
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage installation, maintenance, and repair tasks for field
            technicians
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Assign New Task
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Today's Pending Tasks
          </h3>
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">�️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pending tasks
            </h3>
            <p className="text-gray-500 mb-6">
              All technicians are available. Assign new installations, repairs,
              or site surveys.
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Assign New Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
