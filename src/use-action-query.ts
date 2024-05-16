export const useActionQuery = <T extends { success: any; error: any }>(
  actionKey: string | null,
  actionMethod: () => T
): {
  data: T["success"];
  error: T["error"];
} => {
  return {
    data: "salam",
    error: "salam",
  };
};
