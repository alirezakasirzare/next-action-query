import { useState, useEffect, useCallback } from "react";
import { useCache } from "./action-query-provider";

type ActionKey = string | null;

type ServerActionResult = { success?: any; error?: any };

type ActionMethod<T extends ServerActionResult, J> =
  | (() => Promise<T>)
  | (() => T);

type UseActionMutateResult<T extends ServerActionResult, J> = {
  data: T["success"];
  error: T["error"];
  isLoading: boolean;
  isFetching: boolean;
  refresh: () => void;
};

type UseActionMutateParams<T extends ServerActionResult> = {
  onSuccess?: (values: T["success"]) => void;
  onError?: (values: T["error"]) => void;
};

export const useActionQuery = <T extends ServerActionResult, J>(
  actionKey: ActionKey,
  actionMethod: ActionMethod<T, J>,
  { onError, onSuccess }: UseActionMutateParams<T> = {}
): UseActionMutateResult<T, J> => {
  const { cache, setCache } = useCache();

  const [data, setData] = useState<null | T["success"]>(
    (actionKey && cache[actionKey]) || null
  );
  const [error, setError] = useState<null | T["error"]>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mutate = useCallback(async () => {
    if (!actionKey) {
      return;
    }

    try {
      setIsLoading(true);

      const methodResult = await actionMethod();
      if (methodResult.success) {
        setData(methodResult.success);
        setError(null);
        setCache((prev) => ({
          ...prev,
          [actionKey]: methodResult.success,
        }));
        if (onSuccess) {
          onSuccess(methodResult.success);
        }
      } else if (methodResult.error) {
        setError(methodResult.error);
        setData(null);
        if (onError) {
          onError(methodResult.error);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : error);
    } finally {
      setIsLoading(false);
    }
  }, [actionKey, actionMethod, onError, onSuccess, setCache]);

  useEffect(() => {
    mutate();
  }, [mutate]);

  return {
    data,
    error,
    isLoading: !data && isLoading,
    isFetching: isLoading,
    refresh: mutate,
  };
};
