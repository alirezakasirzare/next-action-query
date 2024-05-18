"use client";

import { createContext, useState } from "react";

type Cache = {
  [CacheKey: string]: any;
};

type ActionQueryContextType = {
  cache: Cache;
  setCache: React.Dispatch<React.SetStateAction<Cache>>;
};

type Props = {
  children: React.ReactNode;
};

const ActionQueryContext = createContext<ActionQueryContextType>({
  cache: {},
  setCache: () => {},
});
export const ActionQueryProvider = ({ children }: Props) => {
  const [cache, setCache] = useState<Cache>({});

  return (
    <ActionQueryContext.Provider
      value={{
        cache,
        setCache,
      }}
    >
      {children}
    </ActionQueryContext.Provider>
  );
};
