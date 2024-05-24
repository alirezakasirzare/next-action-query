"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Cache = {
  [CacheKey: string]: {
    value: any;
    method: (() => void) | (() => Promise<void>);
  };
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

const accessCache: any = {};

export const ActionQueryProvider = ({ children }: Props) => {
  const [cache, setCache] = useState<Cache>({});
  accessCache.cache = cache;
  accessCache.setCache = setCache;

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

export const useCache = () => useContext(ActionQueryContext);

export const refreshActionKey = (actionKey: string) => {
  const { cache, setCache } = accessCache;

  if (cache[actionKey]) {
    const method: any = cache[actionKey].method;
    method()
      ?.then((result: any) => {
        if (result?.success) {
          setCache((prev: any) => ({
            ...prev,
            [actionKey]: { value: result.success, method },
          }));
        }
      })
      ?.catch(() => {});
  }
};
