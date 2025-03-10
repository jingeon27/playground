import { UseSuspenseInfiniteQueryResult } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

export function useInfiniteScrollRef<T extends Element>({
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: UseSuspenseInfiniteQueryResult) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  return useCallback(
    (node: T) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  );
}
