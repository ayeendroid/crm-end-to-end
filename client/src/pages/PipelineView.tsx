import React, { useState, useMemo } from "react";
import {
  Calendar,
  User,
  Phone,
  MapPin,
  Search,
  Target,
  Wifi,
  Activity,
  TrendingUp,
} from "lucide-react";
import { connectionLeads, type ConnectionLead } from "../services/dataService";

interface Stage {
  id: string;
  name: string;
  color: string;
  leads: ConnectionLead[];
  count: number;
  avgProbability: number;
}

const PipelineView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  // Group leads by status
  const stages: Stage[] = useMemo(() => {
    const statusOrder = [
      "New",
      "Contacted",
      "Site Survey Scheduled",
      "Feasibility Check",
      "Quotation Sent",
      "Converted",
      "Lost",
    ];

    const colorMap: Record<string, string> = {
      New: "blue",
      Contacted: "purple",
      "Site Survey Scheduled": "yellow",
      "Feasibility Check": "orange",
      "Quotation Sent": "indigo",
      Converted: "green",
      Lost: "red",
    };

    return statusOrder.map((status) => {
      const stageLeads = connectionLeads.filter((lead) => {
        const matchesStatus = lead.status === status;
        const matchesSearch =
          searchQuery === "" ||
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.location.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          lead.location.state.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority =
          priorityFilter === "All" || lead.priority === priorityFilter;

        return matchesStatus && matchesSearch && matchesPriority;
      });

      const avgProbability =
        stageLeads.length > 0
          ? stageLeads.reduce(
              (sum, lead) => sum + lead.conversionProbability,
              0
            ) / stageLeads.length
          : 0;

      return {
        id: status.toLowerCase().replace(/\s+/g, "-"),
        name: status,
        color: colorMap[status] || "gray",
        leads: stageLeads,
        count: stageLeads.length,
        avgProbability: Math.round(avgProbability),
      };
    });
  }, [searchQuery, priorityFilter]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> =
      {
        blue: {
          bg: "bg-blue-100",
          border: "border-blue-500",
          text: "text-blue-700",
        },
        purple: {
          bg: "bg-purple-100",
          border: "border-purple-500",
          text: "text-purple-700",
        },
        yellow: {
          bg: "bg-yellow-100",
          border: "border-yellow-500",
          text: "text-yellow-700",
        },
        orange: {
          bg: "bg-orange-100",
          border: "border-orange-500",
          text: "text-orange-700",
        },
        indigo: {
          bg: "bg-indigo-100",
          border: "border-indigo-500",
          text: "text-indigo-700",
        },
        green: {
          bg: "bg-green-100",
          border: "border-green-500",
          text: "text-green-700",
        },
        red: {
          bg: "bg-red-100",
          border: "border-red-500",
          text: "text-red-700",
        },
      };
    return colors[color] || colors.blue;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalLeads = stages.reduce((sum, stage) => sum + stage.count, 0);
  const activeLeads = stages
    .filter((s) => s.name !== "Converted" && s.name !== "Lost")
    .reduce((sum, stage) => sum + stage.count, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-8 w-8 text-purple-600" />
            Connection Pipeline
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track new connection requests from inquiry to installation
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:flex-none lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Pipeline</p>
              <p className="text-2xl font-bold text-gray-900">{activeLeads}</p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-gray-900">
                {stages.find((s) => s.name === "Converted")?.count || 0}
              </p>
            </div>
            <Wifi className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {(
                  ((stages.find((s) => s.name === "Converted")?.count || 0) /
                    totalLeads) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <Target className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const colors = getColorClasses(stage.color);
          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
            >
              {/* Stage Header */}
              <div
                className={`${colors.bg} ${colors.border} border-l-4 rounded-lg p-3 mb-4`}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${colors.text}`}>
                    {stage.name}
                  </h3>
                  <span
                    className={`${colors.bg} ${colors.text} px-2 py-1 rounded-full text-sm font-bold`}
                  >
                    {stage.count}
                  </span>
                </div>
                {stage.avgProbability > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    Avg probability: {stage.avgProbability}%
                  </p>
                )}
              </div>

              {/* Lead Cards */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {stage.leads.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No inquiries</p>
                  </div>
                ) : (
                  stage.leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      {/* Lead Name & Priority */}
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {lead.name}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
                            lead.priority
                          )}`}
                        >
                          {lead.priority}
                        </span>
                      </div>

                      {/* Location & Phone */}
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {lead.location.city}, {lead.location.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{lead.phone}</span>
                        </div>
                      </div>

                      {/* Plan & Probability */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-600 font-medium">
                          {lead.requestedPlan.speed} • ₹
                          {lead.requestedPlan.price}
                        </span>
                        <span className="text-xs font-bold text-purple-600">
                          {lead.conversionProbability}% chance
                        </span>
                      </div>

                      {/* Assigned To */}
                      {lead.assignedTo && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <User className="h-3 w-3" />
                          <span>{lead.assignedTo}</span>
                        </div>
                      )}

                      {/* Survey Date if applicable */}
                      {lead.siteSurveyDate && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Survey:{" "}
                            {new Date(lead.siteSurveyDate).toLocaleDateString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineView;
