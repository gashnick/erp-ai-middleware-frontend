"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "lucide-react";
import { FinanceDashboardFilters, PeriodOption } from "../types";

interface PeriodSelectorProps {
  value: FinanceDashboardFilters["period"];
  onChange: (period: FinanceDashboardFilters["period"]) => void;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Quarter", value: "quarter" },
  { label: "Year to Date", value: "ytd" },
  { label: "Custom Range", value: "custom" },
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const selectedLabel =
    PERIOD_OPTIONS.find((opt) => opt.value === value)?.label || "Period";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {selectedLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {PERIOD_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={value === option.value ? "bg-accent" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
