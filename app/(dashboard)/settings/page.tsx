"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";

type SettingsTab = "profile" | "tenant" | "notifications" | "security";

const SETTINGS_TABS: { label: string; value: SettingsTab }[] = [
  { label: "Profile", value: "profile" },
  { label: "Tenant", value: "tenant" },
  { label: "Notifications", value: "notifications" },
  { label: "Security", value: "security" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your account and tenant preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <nav className="flex w-44 flex-shrink-0 flex-col gap-1">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                activeTab === tab.value
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content panel */}
        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900 capitalize mb-4">
            {activeTab}
          </h2>
          <p className="text-sm text-gray-400">
            {activeTab} settings — wire form fields here using React Hook Form +
            Zod, following the same pattern as LoginForm.
          </p>
        </div>
      </div>
    </div>
  );
}
