export const useActionMutate = <
  T extends { success: string; error: string },
  J
>(
  actionKey: string | null,
  actionMethod: () => T
): {
  data: T["success"];
  mutate: (values: J) => void;
} => {
  return {
    mutate: (values: J) => {},
  };
};
