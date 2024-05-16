import { useState } from "react";

type ServerActionResult = { success?: any; error?: any };

type ActionMethod<T extends ServerActionResult, J> =
  | ((values?: J) => Promise<T>)
  | ((values?: J) => T);

type UseActionMutateResult<T extends ServerActionResult, J> = {
  data: T["success"];
  error: T["error"];
  isLoading: boolean;
  mutate: (values?: J) => void;
};

type UseActionMutateParams<T extends ServerActionResult> = {
  onSuccess?: (values: T["success"]) => void;
  onError?: (values: T["error"]) => void;
};

export const useActionMutate = <T extends ServerActionResult, J>(
  actionMethod: ActionMethod<T, J>,
  { onError, onSuccess }: UseActionMutateParams<T> = {}
): UseActionMutateResult<T, J> => {
  const [data, setData] = useState<null | T["success"]>(null);
  const [error, setError] = useState<null | T["error"]>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (values?: J) => {
    try {
      setIsLoading(true);

      const methodResult = await actionMethod(values);
      if (methodResult.success) {
        setData(methodResult.success);
        setError(null);
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
  };

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
