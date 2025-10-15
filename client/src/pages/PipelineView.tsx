import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import dealService, { Deal } from "../services/dealService";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Search, List, Target, TrendingUp, DollarSign } from "lucide-react";

// Stage configuration
const STAGES: Array<{
  id: Deal["stage"];
  name: string;
  color: string;
}> = [
  { id: "prospecting", name: "Prospecting", color: "gray" },
  { id: "qualification", name: "Qualification", color: "blue" },
  { id: "proposal", name: "Proposal", color: "purple" },
  { id: "negotiation", name: "Negotiation", color: "yellow" },
  { id: "closed-won", name: "Closed Won", color: "green" },
  { id: "closed-lost", name: "Closed Lost", color: "red" },
];

// Deal card component
interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

const DealCard: React.FC<DealCardProps> = ({ deal, isDragging = false }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return "text-green-600 bg-green-50";
    if (probability >= 50) return "text-yellow-600 bg-yellow-50";
    if (probability >= 25) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move ${
        isDragging ? "opacity-50 rotate-2" : ""
      }`}
    >
      {/* Deal Title */}
      <h4 className="font-semibold text-gray-900 text-sm mb-2 truncate">
        {deal.title}
      </h4>

      {/* Customer */}
      <div className="text-xs text-gray-600 mb-2">
        {deal.customer.firstName} {deal.customer.lastName}
        {deal.customer.company && (
          <div className="text-gray-500">{deal.customer.company}</div>
        )}
      </div>

      {/* Value */}
      <div className="font-bold text-gray-900 text-base mb-2">
        {formatCurrency(deal.value)}
      </div>

      {/* Probability Badge */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span
          className={`text-xs px-2 py-1 rounded-full font-semibold ${getProbabilityColor(
            deal.probability
          )}`}
        >
          {deal.probability}%
        </span>
        {deal.assignedTo && (
          <span className="text-xs text-gray-500 truncate max-w-[120px]">
            {deal.assignedTo.name}
          </span>
        )}
      </div>

      {/* Expected Close Date */}
      <div className="text-xs text-gray-500 mt-2">
        Close:{" "}
        {new Date(deal.expectedCloseDate).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
  );
};

const PipelineView: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDealId, setActiveDealId] = useState<string | null>(null);

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  // Fetch deals
  const { data: dealsResponse, isLoading } = useQuery(
    ["deals", { limit: 1000 }],
    () => dealService.getDeals({ limit: 1000 }),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Change deal stage mutation
  const changeStageMutation = useMutation(
    ({ dealId, newStage }: { dealId: string; newStage: Deal["stage"] }) =>
      dealService.changeDealStage(dealId, newStage),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("deals");
      },
      onError: (error: any) => {
        alert(error?.response?.data?.message || "Failed to update deal stage");
      },
    }
  );

  // Filter and group deals by stage
  const dealsByStage = useMemo(() => {
    if (!dealsResponse?.deals) {
      return STAGES.map((stage) => ({
        ...stage,
        deals: [],
        totalValue: 0,
        count: 0,
      }));
    }

    const filtered = dealsResponse.deals.filter((deal) => {
      if (!searchQuery) return true;
      const search = searchQuery.toLowerCase();
      return (
        deal.title.toLowerCase().includes(search) ||
        `${deal.customer.firstName} ${deal.customer.lastName}`
          .toLowerCase()
          .includes(search) ||
        deal.customer.company?.toLowerCase().includes(search) ||
        false
      );
    });

    return STAGES.map((stage) => {
      const stageDeals = filtered.filter((deal) => deal.stage === stage.id);
      const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

      return {
        ...stage,
        deals: stageDeals,
        totalValue,
        count: stageDeals.length,
      };
    });
  }, [dealsResponse, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!dealsResponse?.deals) {
      return {
        totalValue: 0,
        totalCount: 0,
        wonValue: 0,
        wonCount: 0,
        conversionRate: 0,
      };
    }

    const totalValue = dealsResponse.deals.reduce(
      (sum, deal) => sum + deal.value,
      0
    );
    const wonDeals = dealsResponse.deals.filter(
      (d) => d.stage === "closed-won"
    );
    const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    const wonCount = wonDeals.length;
    const totalCount = dealsResponse.deals.length;
    const conversionRate = totalCount > 0 ? (wonCount / totalCount) * 100 : 0;

    return {
      totalValue,
      totalCount,
      wonValue,
      wonCount,
      conversionRate,
    };
  }, [dealsResponse]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDealId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDealId(null);

    if (!over || active.id === over.id) return;

    const dealId = active.id as string;
    const newStage = over.id as Deal["stage"];

    // Check if dropping on a valid stage
    if (!STAGES.find((s) => s.id === newStage)) return;

    // Find the deal
    const deal = dealsResponse?.deals.find((d) => d._id === dealId);
    if (!deal || deal.stage === newStage) return;

    // Confirm stage change for closed stages
    if (newStage === "closed-won" || newStage === "closed-lost") {
      const stageName =
        newStage === "closed-won" ? "Closed Won" : "Closed Lost";
      if (
        !window.confirm(
          `Are you sure you want to mark "${deal.title}" as ${stageName}?`
        )
      ) {
        return;
      }
    }

    // Update deal stage
    changeStageMutation.mutate({ dealId, newStage });
  };

  // Get the active deal for drag overlay
  const activeDeal = activeDealId
    ? dealsResponse?.deals.find((d) => d._id === activeDealId)
    : null;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get color classes for stages
  const getColorClasses = (color: string) => {
    const colors: Record<
      string,
      { bg: string; border: string; text: string; badge: string }
    > = {
      gray: {
        bg: "bg-gray-100",
        border: "border-gray-500",
        text: "text-gray-700",
        badge: "bg-gray-200 text-gray-800",
      },
      blue: {
        bg: "bg-blue-100",
        border: "border-blue-500",
        text: "text-blue-700",
        badge: "bg-blue-200 text-blue-800",
      },
      purple: {
        bg: "bg-purple-100",
        border: "border-purple-500",
        text: "text-purple-700",
        badge: "bg-purple-200 text-purple-800",
      },
      yellow: {
        bg: "bg-yellow-100",
        border: "border-yellow-500",
        text: "text-yellow-700",
        badge: "bg-yellow-200 text-yellow-800",
      },
      green: {
        bg: "bg-green-100",
        border: "border-green-500",
        text: "text-green-700",
        badge: "bg-green-200 text-green-800",
      },
      red: {
        bg: "bg-red-100",
        border: "border-red-500",
        text: "text-red-700",
        badge: "bg-red-200 text-red-800",
      },
    };
    return colors[color] || colors.gray;
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">Loading pipeline...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            Deal Pipeline
          </h1>
          <p className="text-gray-600 mt-1">
            Drag deals between stages to update their status
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => (window.location.href = "/deals")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <List className="w-5 h-5" />
            List View
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pipeline</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalCount} deals
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Won Deals</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.wonValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.wonCount} deals
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.conversionRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">win rate</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Deal</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalCount > 0
                  ? formatCurrency(stats.totalValue / stats.totalCount)
                  : formatCurrency(0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">deal size</p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {dealsByStage.map((stage) => {
            const colors = getColorClasses(stage.color);
            return (
              <div
                key={stage.id}
                id={stage.id}
                className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
              >
                {/* Stage Header */}
                <div
                  className={`${colors.bg} ${colors.border} border-l-4 rounded-lg p-3 mb-4`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${colors.text}`}>
                      {stage.name}
                    </h3>
                    <span
                      className={`${colors.badge} px-2 py-1 rounded-full text-sm font-bold`}
                    >
                      {stage.count}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {formatCurrency(stage.totalValue)}
                  </p>
                </div>

                {/* Drop Zone for Deals */}
                <div
                  data-stage={stage.id}
                  className="space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto"
                >
                  {stage.deals.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No deals</p>
                    </div>
                  ) : (
                    stage.deals.map((deal) => (
                      <div
                        key={deal._id}
                        id={deal._id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("dealId", deal._id);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = "move";
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const dealId = e.dataTransfer.getData("dealId");
                          if (dealId && dealId !== deal._id) {
                            // Handle dropping on another deal card
                            // (could implement reordering within stage here)
                          }
                        }}
                      >
                        <DealCard
                          deal={deal}
                          isDragging={activeDealId === deal._id}
                        />
                      </div>
                    ))
                  )}

                  {/* Drop Zone Area */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const dealId = e.dataTransfer.getData("dealId");
                      if (dealId) {
                        const deal = dealsResponse?.deals.find(
                          (d) => d._id === dealId
                        );
                        if (deal && deal.stage !== stage.id) {
                          // Confirm stage change for closed stages
                          if (
                            stage.id === "closed-won" ||
                            stage.id === "closed-lost"
                          ) {
                            const stageName =
                              stage.id === "closed-won"
                                ? "Closed Won"
                                : "Closed Lost";
                            if (
                              !window.confirm(
                                `Are you sure you want to mark "${deal.title}" as ${stageName}?`
                              )
                            ) {
                              return;
                            }
                          }
                          changeStageMutation.mutate({
                            dealId,
                            newStage: stage.id,
                          });
                        }
                      }
                    }}
                    className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm"
                  >
                    Drop here
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default PipelineView;
