"use client";

import { useState } from "react";
import { Upload, AlertTriangle, Info } from "lucide-react";
import { UploadDropzone } from "@/features/import/components/UploadDropzone";
import { EntityTypeSelector } from "@/features/import/components/EntityTypeSelector";
import { JobProgressTracker } from "@/features/import/components/JobProgressTracker";
import { QuarantineTable } from "@/features/import/components/QuarantineTable";
import { useFileUpload } from "@/features/import/hooks/useFileUpload";
import { useBuildGraph } from "@/features/import/hooks/useQuarantine";
import { ENTITY_TYPE_CONFIG, type EntityType } from "@/features/import/types";
import { cn } from "@/utils/cn";

type ActiveTab = "upload" | "quarantine";

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEntityType, setSelectedEntityType] =
    useState<EntityType | null>(null);

  const { upload, isUploading, isPolling, jobId, job, uploadError, reset } =
    useFileUpload();
  const buildGraphMutation = useBuildGraph();

  const isProcessing = isUploading || isPolling;
  const canUpload = selectedFile && selectedEntityType && !isProcessing;

  function handleUpload() {
    if (!selectedFile || !selectedEntityType) return;
    upload(selectedFile, selectedEntityType);
  }

  function handleReset() {
    reset();
    setSelectedFile(null);
    setSelectedEntityType(null);
  }

  const jobComplete = job?.status === "completed" || job?.status === "failed";

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Data Import</h1>
        <p className="text-sm text-gray-500">
          Import data from CSV files into your tenant workspace
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {(["upload", "quarantine"] as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px capitalize",
              activeTab === tab
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:text-gray-900",
            )}
          >
            {tab === "upload" ? (
              <span className="flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5" />
                Upload CSV
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Quarantine
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left — form */}
          <div className="flex flex-col gap-5">
            {/* Step 1 — Select entity type */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  1
                </div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Select data type
                </h2>
              </div>
              <EntityTypeSelector
                value={selectedEntityType}
                onChange={setSelectedEntityType}
                isDisabled={isProcessing}
              />
            </div>

            {/* Step 2 — Upload file */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  2
                </div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Upload CSV file
                </h2>
              </div>
              <UploadDropzone
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                onClear={() => setSelectedFile(null)}
                isDisabled={isProcessing}
              />
            </div>

            {/* Upload error */}
            {uploadError && (
              <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                {uploadError}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleUpload}
                disabled={!canUpload}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                {isUploading
                  ? "Uploading…"
                  : isPolling
                    ? "Processing…"
                    : "Import CSV"}
              </button>

              {jobComplete && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-md border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  New Import
                </button>
              )}
            </div>
          </div>

          {/* Right — status + info */}
          <div className="flex flex-col gap-4">
            {/* Job tracker */}
            {jobId && job && (
              <JobProgressTracker
                jobId={jobId}
                job={job}
                onBuildGraph={
                  job.status === "completed"
                    ? () => buildGraphMutation.mutate()
                    : undefined
                }
                isBuildingGraph={buildGraphMutation.isPending}
              />
            )}

            {/* Format guide */}
            {selectedEntityType && !jobId && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-700">
                    Expected CSV columns for{" "}
                    {ENTITY_TYPE_CONFIG[selectedEntityType].label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ENTITY_TYPE_CONFIG[selectedEntityType].expectedHeaders.map(
                    (h) => (
                      <span
                        key={h}
                        className="rounded-md bg-white border border-gray-200 px-2 py-0.5 font-mono text-[11px] text-gray-600"
                      >
                        {h}
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Empty guide */}
            {!selectedEntityType && !jobId && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 py-12 text-center">
                <Upload className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                <p className="text-sm font-medium text-gray-500">
                  Select a data type to get started
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  We'll show you the expected CSV format
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quarantine Tab */}
      {activeTab === "quarantine" && <QuarantineTable />}
    </div>
  );
}
