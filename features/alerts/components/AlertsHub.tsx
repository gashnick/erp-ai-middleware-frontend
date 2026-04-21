"use client";

import { useState } from "react";
import { AlertRule } from "../types";
import { useAlertRules } from "../hooks/useAlertRules";
import { useOpenAlerts } from "../hooks/useAlertEvents";
import { useAlertStats } from "../hooks/useAlertStats";
import { useCreateAlertRule, useUpdateAlertRule, useDeleteAlertRule } from "../hooks/useAlertRules";
import { useAcknowledgeAlertEvent, useResolveAlertEvent } from "../hooks/useAlertEvents";
import { AlertRulesPanel } from "./AlertRulesPanel";
import { OpenAlertsPanel } from "./OpenAlertsPanel";
import { AlertStatsCards } from "./AlertStatsCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Settings } from "lucide-react";

export function AlertsHub() {
  const [activeTab, setActiveTab] = useState<"rules" | "alerts">("alerts");
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);

  // Queries
  const { data: rulesData, isLoading: rulesLoading } = useAlertRules();
  const { data: alertsData, isLoading: alertsLoading } = useOpenAlerts();
  const { data: stats } = useAlertStats();

  // Mutations
  const createRule = useCreateAlertRule();
  const updateRule = useUpdateAlertRule(editingRule?.id || "");
  const deleteRule = useDeleteAlertRule();
  const acknowledgeAlert = useAcknowledgeAlertEvent();
  const resolveAlert = useResolveAlertEvent();

  const handleCreateRule = (dto: any) => {
    createRule.mutate(dto, {
      onSuccess: () => {
        setShowRuleForm(false);
      },
    });
  };

  const handleUpdateRule = (dto: any) => {
    updateRule.mutate(dto, {
      onSuccess: () => {
        setEditingRule(null);
        setShowRuleForm(false);
      },
    });
  };

  const handleEditRule = (rule: AlertRule) => {
    setEditingRule(rule);
    setShowRuleForm(true);
  };

  const handleDeleteRule = (id: string) => {
    if (confirm("Are you sure you want to delete this alert rule?")) {
      deleteRule.mutate(id);
    }
  };

  const handleToggleRule = (id: string, isActive: boolean) => {
    updateRule.mutate({ is_active: isActive });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && <AlertStatsCards stats={stats} />}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts" className="gap-2">
            <Bell className="h-4 w-4" />
            Open Alerts ({stats?.open_events || 0})
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-2">
            <Settings className="h-4 w-4" />
            Alert Rules ({stats?.active_rules || 0})
          </TabsTrigger>
        </TabsList>

        {/* Open Alerts Tab */}
        <TabsContent value="alerts" className="mt-6">
          <OpenAlertsPanel
            events={alertsData?.data || []}
            isLoading={alertsLoading}
            onAcknowledge={(id) =>
              acknowledgeAlert.mutate(id)
            }
            onResolve={(id) => resolveAlert.mutate(id)}
            isProcessing={acknowledgeAlert.isPending || resolveAlert.isPending}
          />
        </TabsContent>

        {/* Alert Rules Tab */}
        <TabsContent value="rules" className="mt-6">
          <AlertRulesPanel
            rules={rulesData?.data || []}
            isLoading={rulesLoading}
            showForm={showRuleForm}
            editingRule={editingRule}
            onCreateClick={() => {
              setEditingRule(null);
              setShowRuleForm(true);
            }}
            onFormSubmit={editingRule ? handleUpdateRule : handleCreateRule}
            onFormCancel={() => {
              setShowRuleForm(false);
              setEditingRule(null);
            }}
            onEdit={handleEditRule}
            onDelete={handleDeleteRule}
            onToggle={handleToggleRule}
            isFormLoading={createRule.isPending || updateRule.isPending}
            isDeleting={deleteRule.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
