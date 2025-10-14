import React, { useState } from "react";
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  User,
  MessageSquare,
  Video,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

// Activity type definition
export interface Activity {
  id: string;
  type: "call" | "email" | "meeting" | "note" | "task" | "message" | "video";
  title: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  customer?: string;
  timestamp: Date;
  status?: "completed" | "pending" | "cancelled";
}

interface ActivityTimelineProps {
  activities?: Activity[];
  maxVisible?: number;
  showLoadMore?: boolean;
}

// Helper function to format relative time
const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

// Get activity icon and colors
const getActivityConfig = (type: Activity["type"]) => {
  const configs = {
    call: {
      icon: Phone,
      gradient: "from-green-500 to-emerald-600",
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    email: {
      icon: Mail,
      gradient: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    meeting: {
      icon: Calendar,
      gradient: "from-purple-500 to-pink-600",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    note: {
      icon: FileText,
      gradient: "from-orange-500 to-red-600",
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    task: {
      icon: CheckCircle,
      gradient: "from-teal-500 to-cyan-600",
      bg: "bg-teal-50",
      text: "text-teal-700",
      border: "border-teal-200",
    },
    message: {
      icon: MessageSquare,
      gradient: "from-pink-500 to-rose-600",
      bg: "bg-pink-50",
      text: "text-pink-700",
      border: "border-pink-200",
    },
    video: {
      icon: Video,
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-200",
    },
  };
  return configs[type];
};

// Mock activities data
const mockActivities: Activity[] = [
  {
    id: "1",
    type: "call",
    title: "Phone call with Acme Corporation",
    description:
      "Discussed Q4 requirements and pricing. Very interested in premium plan.",
    user: {
      name: "Rajesh Kumar",
      initials: "RK",
    },
    customer: "Acme Corporation",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "completed",
  },
  {
    id: "2",
    type: "email",
    title: "Sent proposal to TechStart India",
    description:
      "Detailed proposal with pricing and implementation timeline attached.",
    user: {
      name: "Priya Sharma",
      initials: "PS",
    },
    customer: "TechStart India Ltd",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: "completed",
  },
  {
    id: "3",
    type: "meeting",
    title: "Product demo scheduled",
    description:
      "Online demo meeting with decision makers next Tuesday at 3 PM.",
    user: {
      name: "Amit Patel",
      initials: "AP",
    },
    customer: "Global Solutions Pvt Ltd",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    status: "pending",
  },
  {
    id: "4",
    type: "note",
    title: "Added follow-up note",
    description:
      "Customer needs time to discuss with team. Follow up next week.",
    user: {
      name: "Sneha Reddy",
      initials: "SR",
    },
    customer: "Digital Innovations Inc",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
  },
  {
    id: "5",
    type: "task",
    title: "Completed contract review",
    description: "Legal team approved all terms. Ready to send for signature.",
    user: {
      name: "Vikram Singh",
      initials: "VS",
    },
    customer: "Enterprise Corp",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: "completed",
  },
  {
    id: "6",
    type: "message",
    title: "WhatsApp message received",
    description:
      "Customer inquired about bulk discount pricing and payment terms.",
    user: {
      name: "Anita Desai",
      initials: "AD",
    },
    customer: "Retail Solutions Ltd",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: "7",
    type: "video",
    title: "Video consultation completed",
    description:
      "Walked through platform features and answered technical questions.",
    user: {
      name: "Karthik Menon",
      initials: "KM",
    },
    customer: "Tech Innovators",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    status: "completed",
  },
  {
    id: "8",
    type: "call",
    title: "Follow-up call scheduled",
    description:
      "Reminder to call customer next Monday regarding contract signing.",
    user: {
      name: "Deepak Gupta",
      initials: "DG",
    },
    customer: "Metro Services",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: "pending",
  },
];

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities = mockActivities,
  maxVisible = 5,
  showLoadMore = true,
}) => {
  const [visibleCount, setVisibleCount] = useState(maxVisible);
  const visibleActivities = activities.slice(0, visibleCount);
  const hasMore = visibleCount < activities.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, activities.length));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-500 mt-1">
            Latest interactions and updates
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {visibleActivities.map((activity, index) => {
          const config = getActivityConfig(activity.type);
          const Icon = config.icon;
          const isLast = index === visibleActivities.length - 1;

          return (
            <div key={activity.id} className="relative">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-[27px] top-[56px] bottom-[-12px] w-0.5 bg-gray-200" />
              )}

              {/* Activity Item */}
              <div className="relative flex gap-4 pb-6 group">
                {/* Icon container with gradient */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} 
                    flex items-center justify-center shadow-md group-hover:shadow-lg 
                    transition-all duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Status indicator */}
                  {activity.status === "completed" && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full 
                      border-2 border-white flex items-center justify-center shadow-sm"
                    >
                      <CheckCircle className="w-3 h-3 text-white fill-current" />
                    </div>
                  )}
                  {activity.status === "pending" && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full 
                      border-2 border-white flex items-center justify-center shadow-sm"
                    >
                      <Clock className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  {/* Title and timestamp */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3
                      className="font-semibold text-gray-900 group-hover:text-purple-600 
                      transition-colors cursor-pointer"
                    >
                      {activity.title}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getRelativeTime(activity.timestamp)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {activity.description}
                  </p>

                  {/* Footer with user and customer */}
                  <div className="flex items-center gap-4 text-xs">
                    {/* User avatar */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full ${config.bg} ${config.text} 
                        flex items-center justify-center font-semibold text-[10px] 
                        border ${config.border}`}
                      >
                        {activity.user.initials}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {activity.user.name}
                      </span>
                    </div>

                    {/* Customer */}
                    {activity.customer && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-600 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {activity.customer}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {showLoadMore && hasMore && (
        <div className="pt-2 border-t border-gray-200">
          <button
            onClick={handleLoadMore}
            className="w-full py-3 text-sm font-medium text-purple-600 hover:text-purple-700 
              hover:bg-purple-50 rounded-lg transition-all duration-200 flex items-center 
              justify-center gap-2 group"
          >
            Load More Activities
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Empty state */}
      {activities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No activities yet
          </h3>
          <p className="text-sm text-gray-500">
            Activities will appear here as you interact with customers
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
