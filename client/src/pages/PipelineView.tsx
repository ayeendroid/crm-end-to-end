import React, { useState } from "react";
import {
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail,
  MoreVertical,
  Plus,
  Filter,
  Search,
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  probability: number;
  contact: string;
  email: string;
  phone: string;
  closeDate: string;
  tags: string[];
  aiScore: number;
  activities: number;
}

interface Stage {
  id: string;
  name: string;
  color: string;
  deals: Deal[];
  totalValue: number;
  winRate: number;
}

const PipelineView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);

  // Mock data - in production, this would come from API
  const [stages, setStages] = useState<Stage[]>([
    {
      id: "prospecting",
      name: "Prospecting",
      color: "blue",
      winRate: 10,
      totalValue: 450000,
      deals: [
        {
          id: "1",
          title: "Enterprise Plan - Q1",
          company: "TechCorp India",
          value: 150000,
          probability: 15,
          contact: "Rajesh Kumar",
          email: "rajesh@techcorp.in",
          phone: "+91 98765 43210",
          closeDate: "2024-06-30",
          tags: ["Enterprise", "Hot Lead"],
          aiScore: 72,
          activities: 5,
        },
        {
          id: "2",
          title: "Premium Package",
          company: "StartupX",
          value: 85000,
          probability: 12,
          contact: "Priya Sharma",
          email: "priya@startupx.com",
          phone: "+91 98123 45678",
          closeDate: "2024-07-15",
          tags: ["Startup", "Follow-up"],
          aiScore: 68,
          activities: 3,
        },
        {
          id: "3",
          title: "Standard Plan",
          company: "Local Business Co",
          value: 45000,
          probability: 10,
          contact: "Amit Patel",
          email: "amit@localbiz.com",
          phone: "+91 97654 32109",
          closeDate: "2024-08-01",
          tags: ["SMB"],
          aiScore: 58,
          activities: 2,
        },
      ],
    },
    {
      id: "qualification",
      name: "Qualification",
      color: "purple",
      winRate: 30,
      totalValue: 620000,
      deals: [
        {
          id: "4",
          title: "Enterprise Solution",
          company: "MegaCorp Ltd",
          value: 320000,
          probability: 35,
          contact: "Sneha Reddy",
          email: "sneha@megacorp.in",
          phone: "+91 99876 54321",
          closeDate: "2024-06-15",
          tags: ["Enterprise", "Decision Maker"],
          aiScore: 85,
          activities: 12,
        },
        {
          id: "5",
          title: "Growth Package",
          company: "ScaleUp Inc",
          value: 180000,
          probability: 28,
          contact: "Vikram Singh",
          email: "vikram@scaleup.com",
          phone: "+91 98765 11111",
          closeDate: "2024-07-01",
          tags: ["Growth", "Budget Approved"],
          aiScore: 78,
          activities: 8,
        },
        {
          id: "6",
          title: "Professional Plan",
          company: "Agency Works",
          value: 120000,
          probability: 25,
          contact: "Neha Gupta",
          email: "neha@agencyworks.in",
          phone: "+91 97777 88888",
          closeDate: "2024-07-20",
          tags: ["Agency"],
          aiScore: 71,
          activities: 6,
        },
      ],
    },
    {
      id: "proposal",
      name: "Proposal",
      color: "pink",
      winRate: 50,
      totalValue: 890000,
      deals: [
        {
          id: "7",
          title: "Custom Enterprise Deal",
          company: "Global Tech Solutions",
          value: 550000,
          probability: 55,
          contact: "Arjun Mehta",
          email: "arjun@globaltech.com",
          phone: "+91 99999 00000",
          closeDate: "2024-06-10",
          tags: ["Enterprise", "Proposal Sent", "High Value"],
          aiScore: 92,
          activities: 18,
        },
        {
          id: "8",
          title: "Premium Bundle",
          company: "Innovate Labs",
          value: 220000,
          probability: 48,
          contact: "Kavya Iyer",
          email: "kavya@innovatelabs.in",
          phone: "+91 98888 77777",
          closeDate: "2024-06-25",
          tags: ["Premium", "Demo Done"],
          aiScore: 81,
          activities: 10,
        },
        {
          id: "9",
          title: "Standard Plus",
          company: "CloudFirst Co",
          value: 120000,
          probability: 45,
          contact: "Rohit Verma",
          email: "rohit@cloudfirst.com",
          phone: "+91 97777 66666",
          closeDate: "2024-07-05",
          tags: ["Standard"],
          aiScore: 74,
          activities: 7,
        },
      ],
    },
    {
      id: "negotiation",
      name: "Negotiation",
      color: "orange",
      winRate: 70,
      totalValue: 1250000,
      deals: [
        {
          id: "10",
          title: "Multi-Year Contract",
          company: "Enterprise Networks",
          value: 850000,
          probability: 75,
          contact: "Deepak Joshi",
          email: "deepak@entnetworks.in",
          phone: "+91 99000 11111",
          closeDate: "2024-05-30",
          tags: ["Enterprise", "Multi-Year", "Legal Review"],
          aiScore: 95,
          activities: 25,
        },
        {
          id: "11",
          title: "Premium Annual",
          company: "Tech Innovators",
          value: 280000,
          probability: 68,
          contact: "Ananya Das",
          email: "ananya@techinnovators.com",
          phone: "+91 98111 22222",
          closeDate: "2024-06-05",
          tags: ["Premium", "Price Discussion"],
          aiScore: 88,
          activities: 15,
        },
        {
          id: "12",
          title: "Growth Plan",
          company: "Future Systems",
          value: 120000,
          probability: 65,
          contact: "Sanjay Rao",
          email: "sanjay@futuresys.in",
          phone: "+91 97222 33333",
          closeDate: "2024-06-12",
          tags: ["Growth"],
          aiScore: 82,
          activities: 11,
        },
      ],
    },
    {
      id: "closed-won",
      name: "Closed Won",
      color: "green",
      winRate: 100,
      totalValue: 980000,
      deals: [
        {
          id: "13",
          title: "Enterprise Package",
          company: "Acme Corporation",
          value: 450000,
          probability: 100,
          contact: "Meera Shah",
          email: "meera@acme.com",
          phone: "+91 99333 44444",
          closeDate: "2024-05-15",
          tags: ["Enterprise", "Closed", "Onboarding"],
          aiScore: 98,
          activities: 30,
        },
        {
          id: "14",
          title: "Premium Suite",
          company: "Digital Masters",
          value: 320000,
          probability: 100,
          contact: "Karthik Reddy",
          email: "karthik@digitalmasters.in",
          phone: "+91 98444 55555",
          closeDate: "2024-05-20",
          tags: ["Premium", "Closed"],
          aiScore: 96,
          activities: 22,
        },
        {
          id: "15",
          title: "Standard Annual",
          company: "QuickStart Ltd",
          value: 210000,
          probability: 100,
          contact: "Pooja Nair",
          email: "pooja@quickstart.com",
          phone: "+91 97555 66666",
          closeDate: "2024-05-22",
          tags: ["Standard", "Closed"],
          aiScore: 94,
          activities: 16,
        },
      ],
    },
  ]);

  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStageId: string) => {
    if (!draggedDeal) return;

    setStages((prevStages) => {
      const newStages = [...prevStages];
      let draggedDealObj: Deal | null = null;

      // Find and remove the deal from source stage
      for (let i = 0; i < newStages.length; i++) {
        const dealIndex = newStages[i].deals.findIndex(
          (d) => d.id === draggedDeal
        );
        if (dealIndex !== -1) {
          draggedDealObj = newStages[i].deals[dealIndex];
          newStages[i].deals.splice(dealIndex, 1);
          break;
        }
      }

      // Add to target stage
      if (draggedDealObj) {
        const targetStageIndex = newStages.findIndex(
          (s) => s.id === targetStageId
        );
        if (targetStageIndex !== -1) {
          newStages[targetStageIndex].deals.push(draggedDealObj);
        }
      }

      return newStages;
    });

    setDraggedDeal(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

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
        pink: {
          bg: "bg-pink-100",
          border: "border-pink-500",
          text: "text-pink-700",
        },
        orange: {
          bg: "bg-orange-100",
          border: "border-orange-500",
          text: "text-orange-700",
        },
        green: {
          bg: "bg-green-100",
          border: "border-green-500",
          text: "text-green-700",
        },
      };
    return colors[color] || colors.blue;
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 75) return "text-blue-600 bg-blue-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  const totalPipelineValue = stages.reduce(
    (sum, stage) => sum + stage.totalValue,
    0
  );
  const totalDeals = stages.reduce((sum, stage) => sum + stage.deals.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-8 w-8 text-purple-600" />
            Sales Pipeline
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Drag and drop deals to move them through stages
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 lg:flex-none lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">New Deal</span>
          </button>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pipeline</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(totalPipelineValue)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalDeals}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expected Close</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">₹1.8L</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Deal Size</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(totalPipelineValue / totalDeals)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-4 min-w-full">
          {stages.map((stage) => {
            const colors = getColorClasses(stage.color);
            return (
              <div
                key={stage.id}
                className="flex-shrink-0 w-80"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stage.id)}
              >
                {/* Stage Header */}
                <div
                  className={`${colors.bg} rounded-t-lg p-4 border-t-4 ${colors.border}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${colors.text}`}>
                      {stage.name}
                    </h3>
                    <span className="text-sm font-medium text-gray-600">
                      {stage.deals.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {formatCurrency(stage.totalValue)}
                    </span>
                    <span className="text-gray-600">
                      {stage.winRate}% win rate
                    </span>
                  </div>
                </div>

                {/* Deals */}
                <div className="bg-gray-50 rounded-b-lg p-3 min-h-[600px] space-y-3">
                  {stage.deals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => handleDragStart(deal.id)}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-move"
                    >
                      {/* Deal Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm mb-1">
                            {deal.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {deal.company}
                          </p>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>

                      {/* Deal Value */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(deal.value)}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${getAIScoreColor(
                              deal.aiScore
                            )}`}
                          >
                            AI: {deal.aiScore}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${colors.bg.replace(
                              "100",
                              "500"
                            )}`}
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">
                          {deal.probability}% probability
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 mb-3 text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{deal.contact}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span>
                            Close:{" "}
                            {new Date(deal.closeDate).toLocaleDateString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{deal.activities} activities</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {deal.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Mail className="h-3 w-3" />
                          Email
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50 rounded transition-colors">
                          <Phone className="h-3 w-3" />
                          Call
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Deal Button */}
                  <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PipelineView;
