import api from "./api";

// Types
export interface Activity {
  _id: string;
  type: "call" | "email" | "meeting" | "task" | "note" | "demo" | "proposal";
  subject: string;
  description?: string;
  relatedTo: {
    type: "customer" | "lead" | "deal";
    id: string;
  };
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  priority: "low" | "medium" | "high" | "urgent";
  scheduledDate?: string;
  completedDate?: string;
  duration?: number;
  location?: string;
  attendees: {
    _id: string;
    name: string;
    email: string;
  }[];
  outcome?: string;
  nextAction?: string;
  nextActionDate?: string;
  attachments: {
    filename: string;
    url: string;
    size: number;
  }[];
  tags: string[];
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityFilters {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  relatedToType?: string;
  relatedToId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ActivitiesResponse {
  success: boolean;
  data: {
    activities: Activity[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface ActivityResponse {
  success: boolean;
  data: Activity;
}

export interface CreateActivityData {
  type: string;
  subject: string;
  description?: string;
  relatedTo: {
    type: string;
    id: string;
  };
  assignedTo: string;
  status?: string;
  priority?: string;
  scheduledDate?: string;
  duration?: number;
  location?: string;
  attendees?: string[];
  tags?: string[];
}

// API Functions
export const getActivities = async (
  filters?: ActivityFilters
): Promise<ActivitiesResponse> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }
  const response = await api.get(`/activities?${params.toString()}`);
  return response.data;
};

export const getActivity = async (id: string): Promise<ActivityResponse> => {
  const response = await api.get(`/activities/${id}`);
  return response.data;
};

export const createActivity = async (
  data: CreateActivityData
): Promise<ActivityResponse> => {
  const response = await api.post("/activities", data);
  return response.data;
};

export const updateActivity = async (
  id: string,
  data: Partial<CreateActivityData>
): Promise<ActivityResponse> => {
  const response = await api.put(`/activities/${id}`, data);
  return response.data;
};

export const deleteActivity = async (
  id: string
): Promise<{ success: boolean; data: { message: string } }> => {
  const response = await api.delete(`/activities/${id}`);
  return response.data;
};

// Utility functions
export const getActivityTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    call: "📞",
    email: "📧",
    meeting: "👥",
    task: "✓",
    note: "📝",
    demo: "🎯",
    proposal: "📄",
  };
  return icons[type] || "📋";
};

export const getActivityTypeColor = (type: string): string => {
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

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: "gray",
    medium: "blue",
    high: "orange",
    urgent: "red",
  };
  return colors[priority] || "gray";
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    scheduled: "blue",
    completed: "green",
    cancelled: "gray",
    "no-show": "red",
  };
  return colors[status] || "gray";
};

export const formatActivityDate = (date?: string): string => {
  if (!date) return "Not scheduled";
  const activityDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (activityDate.toDateString() === today.toDateString()) {
    return `Today at ${activityDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (activityDate.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${activityDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else {
    return activityDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        activityDate.getFullYear() !== today.getFullYear()
          ? "numeric"
          : undefined,
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

export default {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityTypeIcon,
  getActivityTypeColor,
  getPriorityColor,
  getStatusColor,
  formatActivityDate,
};
