import { useCallback, useState, useSyncExternalStore } from "react";

interface useCustomQueryOption {
  key: string[];
  queryFn: () => Promise<any>;
}
class QueryStore {
  map = new Map();
  key: string = "";

  constructor(private readonly options: useCustomQueryOption) {
    this.key = this.options.key.join("-");
  }

  subscribe(onStoreChange: any) {
    console.log(onStoreChange);
    return () => {};
  }

  addQuery() {}

  getSnapShot() {
    return this.map.get(this.options.key);
  }
}

export function useCustomQuery(options: useCustomQueryOption) {
  const [store] = useState(() => new QueryStore(options));
  const getQuery = useSyncExternalStore(
    useCallback(store.subscribe, [store, options]),
    store.getSnapShot,
  );

  return getQuery;
}
