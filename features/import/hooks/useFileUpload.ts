import { useState, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importService } from "../services/import.service";
import type { EntityType, ImportJob } from "../types";

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 60; // 2 min max

interface UseFileUploadReturn {
  upload: (file: File, entityType: EntityType) => void;
  isUploading: boolean;
  isPolling: boolean;
  jobId: string | null;
  job: ImportJob | null;
  uploadError: string | null;
  reset: () => void;
}

export function useFileUpload(): UseFileUploadReturn {
  const queryClient = useQueryClient();
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<ImportJob | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setIsPolling(false);
    attemptsRef.current = 0;
  }, []);

  const startPolling = useCallback(
    (id: string) => {
      setIsPolling(true);
      attemptsRef.current = 0;

      pollRef.current = setInterval(async () => {
        attemptsRef.current += 1;

        if (attemptsRef.current > MAX_POLL_ATTEMPTS) {
          stopPolling();
          setUploadError("Job timed out. Please try again.");
          return;
        }

        try {
          const status = await importService.getJobStatus(id);
          setJob(status);

          if (status.status === "completed" || status.status === "failed") {
            stopPolling();
            // Invalidate quarantine cache in case new records were quarantined
            queryClient.invalidateQueries({
              queryKey: ["import", "quarantine"],
            });
          }
        } catch {
          stopPolling();
          setUploadError("Failed to get job status.");
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling, queryClient],
  );

  const uploadMutation = useMutation({
    mutationFn: ({
      file,
      entityType,
    }: {
      file: File;
      entityType: EntityType;
    }) => importService.uploadCsv(file, entityType),
    onSuccess: (data) => {
      setJobId(data.jobId);
      setJob({ status: "processing" });
      startPolling(data.jobId);
    },
    onError: (error: Error) => {
      setUploadError(error.message);
    },
  });

  const upload = useCallback(
    (file: File, entityType: EntityType) => {
      setUploadError(null);
      setJob(null);
      setJobId(null);
      uploadMutation.mutate({ file, entityType });
    },
    [uploadMutation],
  );

  const reset = useCallback(() => {
    stopPolling();
    setJobId(null);
    setJob(null);
    setUploadError(null);
    uploadMutation.reset();
  }, [stopPolling, uploadMutation]);

  return {
    upload,
    isUploading: uploadMutation.isPending,
    isPolling,
    jobId,
    job,
    uploadError,
    reset,
  };
}
