import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CheckSquare,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  Users,
  FileText,
  Target,
  FileSignature,
  CheckCircle2,
  Circle,
  XCircle,
} from "lucide-react";
import {
  getActivities,
  updateActivity,
  ActivityFilters,
  formatActivityDate,
} from "../services/activityService";
import {
  getTasks,
  updateTask,
  updateChecklistItem,
  TaskFilters,
  formatTaskDate,
  isTaskOverdue,
  isTaskDueToday,
  getChecklistProgress,
} from "../services/taskService";

const Activities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"activities" | "tasks">(
    "activities"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);

  // Activity filters
  const [activityFilters] = useState<ActivityFilters>({
    page: 1,
    limit: 50,
  });

  // Task filters
  const [taskFilters] = useState<TaskFilters>({
    page: 1,
    limit: 50,
  });

  const queryClient = useQueryClient();

  // Fetch activities
  const {
    data: activitiesData,
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useQuery({
    queryKey: ["activities", activityFilters],
    queryFn: () => getActivities(activityFilters),
  });

  // Fetch tasks
  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["tasks", taskFilters],
    queryFn: () => getTasks(taskFilters),
  });

  // Mutations
  const updateActivityMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateChecklistMutation = useMutation({
    mutationFn: ({
      taskId,
      itemIndex,
      completed,
    }: {
      taskId: string;
      itemIndex: number;
      completed: boolean;
    }) => updateChecklistItem(taskId, itemIndex, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const activities = activitiesData?.data?.activities || [];
  const tasks = tasksData?.data?.tasks || [];

  // Calculate stats
  const activityStats = {
    total: activities.length,
    scheduled: activities.filter((a: any) => a.status === "scheduled").length,
    completed: activities.filter((a: any) => a.status === "completed").length,
    highPriority: activities.filter(
      (a: any) => a.priority === "high" || a.priority === "urgent"
    ).length,
  };

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t: any) => t.status === "todo").length,
    inProgress: tasks.filter((t: any) => t.status === "in-progress").length,
    overdue: tasks.filter((t: any) => isTaskOverdue(t)).length,
    dueToday: tasks.filter((t: any) => isTaskDueToday(t)).length,
  };

  // Filter activities
  const filteredActivities = activities.filter((activity: any) => {
    const matchesSearch =
      activity.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.assignedTo.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Filter tasks
  const filteredTasks = tasks.filter((task: any) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleStatusChange = (activityId: string, newStatus: string) => {
    updateActivityMutation.mutate({
      id: activityId,
      data: { status: newStatus },
    });
  };

  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    updateTaskMutation.mutate({
      id: taskId,
      data: { status: newStatus },
    });
  };

  const handleChecklistToggle = (
    taskId: string,
    itemIndex: number,
    completed: boolean
  ) => {
    updateChecklistMutation.mutate({ taskId, itemIndex, completed });
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      call: <Phone className="h-5 w-5" />,
      email: <Mail className="h-5 w-5" />,
      meeting: <Users className="h-5 w-5" />,
      task: <CheckSquare className="h-5 w-5" />,
      note: <FileText className="h-5 w-5" />,
      demo: <Target className="h-5 w-5" />,
      proposal: <FileSignature className="h-5 w-5" />,
    };
    return icons[type] || <FileText className="h-5 w-5" />;
  };

  const getTaskIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      todo: <Circle className="h-5 w-5" />,
      "in-progress": <Clock className="h-5 w-5" />,
      blocked: <XCircle className="h-5 w-5" />,
      completed: <CheckCircle2 className="h-5 w-5" />,
      cancelled: <XCircle className="h-5 w-5" />,
    };
    return icons[status] || <Circle className="h-5 w-5" />;
  };

  const getActivityTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      call: "blue",
      email: "purple",
      meeting: "green",
      task: "orange",
      note: "gray",
      demo: "indigo",
      proposal: "pink",
    };
    return colors[type] || "gray";
  };

  const getActivityPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      low: "gray",
      medium: "blue",
      high: "orange",
      urgent: "red",
    };
    return colors[priority] || "gray";
  };

  const getActivityStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      scheduled: "blue",
      completed: "green",
      cancelled: "gray",
      "no-show": "red",
    };
    return colors[status] || "gray";
  };

  const getTaskPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      low: "gray",
      medium: "blue",
      high: "orange",
      urgent: "red",
    };
    return colors[priority] || "gray";
  };

  const getTaskStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      todo: "gray",
      "in-progress": "blue",
      blocked: "red",
      completed: "green",
      cancelled: "gray",
    };
    return colors[status] || "gray";
  };

  if (activitiesError || tasksError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading data
          </h3>
          <p className="text-gray-500">
            {(activitiesError as Error)?.message ||
              (tasksError as Error)?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Activities & Tasks
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your activities, meetings, calls, and tasks
          </p>
        </div>
        <div className="mt-4 flex gap-2 md:mt-0 md:ml-4">
          <button
            onClick={() => setShowCreateTask(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            New Task
          </button>
          <button
            onClick={() => setShowCreateActivity(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Activity
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("activities")}
            className={`${
              activeTab === "activities"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Calendar className="h-4 w-4" />
            Activities
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {activityStats.total}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`${
              activeTab === "tasks"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <CheckSquare className="h-4 w-4" />
            Tasks
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {taskStats.total}
            </span>
          </button>
        </nav>
      </div>

      {/* Stats Cards */}
      {activeTab === "activities" ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Activities
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activityStats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activityStats.scheduled}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activityStats.completed}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  High Priority
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activityStats.highPriority}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckSquare className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {taskStats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Circle className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">To Do</p>
                <p className="text-2xl font-bold text-gray-900">
                  {taskStats.todo}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {taskStats.inProgress}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {taskStats.overdue}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "activities" ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {activitiesLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No activities
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new activity
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateActivity(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Activity
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredActivities.map((activity: any) => (
                <div
                  key={activity._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div
                        className={`p-2 rounded-lg bg-${getActivityTypeColor(
                          activity.type
                        )}-100`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {activity.subject}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getActivityPriorityColor(
                              activity.priority
                            )}-100 text-${getActivityPriorityColor(
                              activity.priority
                            )}-800`}
                          >
                            {activity.priority}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatActivityDate(activity.scheduledDate)}
                          </span>
                          <span>Assigned to: {activity.assignedTo.name}</span>
                          {activity.relatedTo && (
                            <span className="capitalize">
                              {activity.relatedTo.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <select
                        value={activity.status}
                        onChange={(e) =>
                          handleStatusChange(activity._id, e.target.value)
                        }
                        className={`text-sm rounded-full px-3 py-1 font-medium border-0 bg-${getActivityStatusColor(
                          activity.status
                        )}-100 text-${getActivityStatusColor(
                          activity.status
                        )}-800 focus:ring-2 focus:ring-indigo-500`}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no-show">No Show</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {tasksLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No tasks
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new task
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateTask(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task: any) => {
                const { completed, total } = getChecklistProgress(task);
                const isOverdue = isTaskOverdue(task);
                const isDueToday = isTaskDueToday(task);

                return (
                  <div
                    key={task._id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      isOverdue ? "border-l-4 border-red-500" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 pt-1">
                          {getTaskIcon(task.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {task.title}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getTaskPriorityColor(
                                task.priority
                              )}-100 text-${getTaskPriorityColor(
                                task.priority
                              )}-800`}
                            >
                              {task.priority}
                            </span>
                            {isDueToday && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Due Today
                              </span>
                            )}
                            {isOverdue && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Overdue
                              </span>
                            )}
                          </div>
                          {task.description && (
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatTaskDate(task.dueDate)}
                            </span>
                            <span>Assigned to: {task.assignedTo.name}</span>
                            {total > 0 && (
                              <span>
                                Checklist: {completed}/{total}
                              </span>
                            )}
                          </div>
                          {task.checklist && task.checklist.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {task.checklist.map(
                                (item: any, index: number) => (
                                  <label
                                    key={index}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={item.completed}
                                      onChange={(e) =>
                                        handleChecklistToggle(
                                          task._id,
                                          index,
                                          e.target.checked
                                        )
                                      }
                                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span
                                      className={
                                        item.completed
                                          ? "line-through text-gray-400"
                                          : "text-gray-700"
                                      }
                                    >
                                      {item.item}
                                    </span>
                                  </label>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleTaskStatusChange(task._id, e.target.value)
                          }
                          className={`text-sm rounded-full px-3 py-1 font-medium border-0 bg-${getTaskStatusColor(
                            task.status
                          )}-100 text-${getTaskStatusColor(
                            task.status
                          )}-800 focus:ring-2 focus:ring-indigo-500`}
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="blocked">Blocked</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Placeholder for modals - Will show "Create Activity/Task" message */}
      {showCreateActivity && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create Activity Modal
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Activity creation modal will be implemented in the next iteration.
              For now, use the API directly or backend tools.
            </p>
            <button
              onClick={() => setShowCreateActivity(false)}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showCreateTask && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Create Task Modal
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Task creation modal will be implemented in the next iteration. For
              now, use the API directly or backend tools.
            </p>
            <button
              onClick={() => setShowCreateTask(false)}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
