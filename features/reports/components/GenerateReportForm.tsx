"use client";

import { useState } from "react";
import { Loader2, Download } from "lucide-react";
import { useGenerateReport } from "../hooks/useReports";
import { FORMAT_CONFIG, SECTION_CONFIG } from "../types";
import type { ReportFormat, ReportSection } from "../types";
import { cn } from "@/utils/cn";

export function GenerateReportForm() {
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [sections, setSections] = useState<ReportSection[]>([
    "finance",
    "hr",
    "ops",
  ]);
  const [name, setName] = useState("On-Demand Report");
  const generateMutation = useGenerateReport();

  function toggleSection(section: ReportSection) {
    setSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  }

  function handleGenerate() {
    if (!sections.length) return;
    generateMutation.mutate({ name, format, sections });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        Generate Report Now
      </h3>

      <div className="flex flex-col gap-4">
        {/* Report name */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Report Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="On-Demand Report"
          />
        </div>

        {/* Format selector */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Format
          </label>
          <div className="flex gap-2">
            {(
              Object.entries(FORMAT_CONFIG) as [
                ReportFormat,
                (typeof FORMAT_CONFIG)[ReportFormat],
              ][]
            ).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormat(key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                  format === key
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                )}
              >
                <span>{config.icon}</span>
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section selector */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700">
            Sections to Include
          </label>
          <div className="flex gap-2">
            {(
              Object.entries(SECTION_CONFIG) as [
                ReportSection,
                (typeof SECTION_CONFIG)[ReportSection],
              ][]
            ).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleSection(key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                  sections.includes(key)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                )}
              >
                <span>{config.icon}</span>
                {config.label}
              </button>
            ))}
          </div>
          {sections.length === 0 && (
            <p className="mt-1 text-xs text-red-600">
              Select at least one section
            </p>
          )}
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generateMutation.isPending || sections.length === 0}
          className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              Download {FORMAT_CONFIG[format].label}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
