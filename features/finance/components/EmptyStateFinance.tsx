"use client";

import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateFinanceProps {
  onRetry?: () => void;
}

/**
 * Shown when no financial data is available
 */
export function EmptyStateFinance({ onRetry }: EmptyStateFinanceProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12 px-4">
      <BarChart3 className="mb-4 h-12 w-12 text-gray-400" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        No Financial Data Available
      </h3>
      <p className="mb-6 max-w-sm text-center text-sm text-gray-600">
        Start by importing invoices, expenses, and transactions to see your
        financial dashboard.
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Retry
        </Button>
      )}
    </div>
  );
}
