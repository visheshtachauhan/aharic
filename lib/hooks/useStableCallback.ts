import { useRef, useLayoutEffect, useCallback } from 'react';

/**
 * Creates a stable callback function that won't change across re-renders.
 * This is useful for event handlers passed to child components that are memoized,
 * or for functions used in dependency arrays of other hooks like useEffect.
 *
 * @param callback The function to be memoized.
 * @returns A stable callback function.
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(callback: T): T {
  const callbackRef = useRef<T>(callback);

  // Use useLayoutEffect to update the ref to the latest callback synchronously
  // after DOM mutations but before the browser has a chance to paint.
  // This ensures that the ref is always up-to-date.
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // Return a stable memoized function that calls the latest callback from the ref.
  // The dependency array is empty because this function's identity should never change.
  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    return callbackRef.current(...args);
  }, []) as T;
}