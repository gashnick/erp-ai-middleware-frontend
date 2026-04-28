"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ConfidenceScore } from "./ConfidenceScore";
import { ANOMALY_TYPE_CONFIG, type Insight } from "../types";
import { cn } from "@/utils/cn";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = ANOMALY_TYPE_CONFIG[insight.type];

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-shadow hover:shadow-sm",
        config.colorClass,
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="text-xl leading-none flex-shrink-0">
          {config.icon}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                {config.label}
              </span>
              <p className="mt-0.5 text-sm font-medium text-gray-900 leading-snug">
                {insight.explanation}
              </p>
            </div>
            <ConfidenceScore score={insight.confidence} />
          </div>

          {/* Meta row */}
          <div className="mt-2 flex items-center gap-3 text-xs opacity-60">
            <span>Score: {Math.round(insight.score * 100)}%</span>
            <span>·</span>
            <span>
              {new Date(insight.detectedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {insight.relatedIds?.length > 0 && (
              <>
                <span>·</span>
                <span>{insight.relatedIds.length} related records</span>
              </>
            )}
          </div>

          {/* Expandable details */}
          {(insight.relatedIds?.length > 0 || insight.metadata) && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="mt-2 flex items-center gap-1 text-xs font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3 w-3" /> Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" /> Show details
                </>
              )}
            </button>
          )}

          {expanded && (
            <div className="mt-2 rounded-md bg-white/60 p-3 text-xs space-y-2">
              {insight.relatedIds?.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">Related IDs</p>
                  <div className="flex flex-wrap gap-1">
                    {insight.relatedIds.map((id) => (
                      <span
                        key={id}
                        className="rounded-md bg-white border border-gray-200 px-1.5 py-0.5 font-mono text-[10px] text-gray-600"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {insight.metadata && Object.keys(insight.metadata).length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-1">Metadata</p>
                  <pre className="text-[10px] text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(insight.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
