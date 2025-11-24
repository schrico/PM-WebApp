"use client";

import { FolderKanban, UserPlus, LayoutGrid, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { TypewriterText } from "@/components/TypewriterText";
import { formatNumber } from "@/utils/formatters";

export default function HomePage() {
  const router = useRouter();

  const dashboardCards = [
    {
      title: "My Projects",
      icon: FolderKanban,
      path: "/my-projects",
      color: "bg-blue-500",
      description: "View and manage your assignments",
      count: 7,
    },
    {
      title: "Assign Projects",
      icon: UserPlus,
      path: "/assign-projects",
      color: "bg-purple-500",
      description: "Distribute work to translators",
      count: 5,
    },
    {
      title: "Manage Projects",
      icon: LayoutGrid,
      path: "/manage-projects",
      color: "bg-green-500",
      description: "Oversee all active projects",
      count: 8,
    },
    {
      title: "My Profile",
      icon: User,
      path: "/profile",
      color: "bg-indigo-500",
      description: "Update your information",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5 rounded-3xl" />
        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 dark:text-green-400 text-sm">
              Online
            </span>
          </div>
          <h1 className="text-gray-900 dark:text-white mb-3 text-4xl md:text-5xl">
            <TypewriterText text="Welcome back, " speed={50} delay={0} />
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <TypewriterText text="John" speed={50} delay={700} />
            </span>
            <TypewriterText text="! 👋" speed={50} delay={900} />
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            You&apos;re doing great! Keep up the excellent work.
          </p>
        </div>
      </div>

      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-gray-900 dark:text-white text-2xl mb-2">
          What are we doing today?
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Quick access to your most used features
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              onClick={() => router.push(card.path)}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200 text-left group"
              type="button"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {card.count !== undefined && (
                  <span className="text-2xl text-gray-900 dark:text-white">
                    {formatNumber(card.count)}
                  </span>
                )}
              </div>
              <h3 className="text-gray-900 dark:text-white mb-1">
                {card.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {card.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
