"use client";

import { AlertRule, CreateAlertRuleDto } from "../types";
import { AlertRuleCard } from "./AlertRuleCard";
import { AlertRuleForm } from "./AlertRuleForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AlertRulesPanelProps {
  rules: AlertRule[];
  isLoading: boolean;
  showForm: boolean;
  editingRule: AlertRule | null;
  onCreateClick: () => void;
  onFormSubmit: (dto: CreateAlertRuleDto) => void;
  onFormCancel: () => void;
  onEdit: (rule: AlertRule) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
  isFormLoading?: boolean;
  isDeleting?: boolean;
}

export function AlertRulesPanel({
  rules,
  isLoading,
  showForm,
  editingRule,
  onCreateClick,
  onFormSubmit,
  onFormCancel,
  onEdit,
  onDelete,
  onToggle,
  isFormLoading,
  isDeleting,
}: AlertRulesPanelProps) {
  if (showForm) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          {editingRule ? "Edit Alert Rule" : "Create New Alert Rule"}
        </h2>
        <AlertRuleForm
          rule={editingRule || undefined}
          onSubmit={onFormSubmit}
          onCancel={onFormCancel}
          isLoading={isFormLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Alert Rules</h2>
        <Button onClick={onCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          New Rule
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : rules.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">No alert rules yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Create your first alert rule to get started
          </p>
          <Button onClick={onCreateClick} variant="outline" className="mt-4">
            Create Rule
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rules.map((rule) => (
            <AlertRuleCard
              key={rule.id}
              rule={rule}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
