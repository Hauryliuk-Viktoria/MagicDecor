import { useState, useEffect, useCallback, useRef } from "react";

export const useInfiniteScroll = (fetchMore, options = {}) => {
  const { enabled = true, threshold = 100 } = options;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore || !enabled) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      await fetchMore();
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [fetchMore, hasMore, enabled]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading || !enabled) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading && enabled) {
            loadMore();
          }
        },
        {
          rootMargin: `${threshold}px`,
        },
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore, enabled, threshold],
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef, loading, hasMore, setHasMore, loadMore };
};
