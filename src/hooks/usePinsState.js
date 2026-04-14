import { useCallback, useEffect, useRef, useState } from "react";
import pinsData from "../data/pins.json";

const INITIAL_BATCH_SIZE = 18;
const LOAD_BATCH_SIZE = 12;

function createBatch(startIndex, size) {
  if (!pinsData.length) {
    return [];
  }

  return Array.from({ length: size }, (_, offset) => {
    const absoluteIndex = startIndex + offset;
    const dataIndex = absoluteIndex % pinsData.length;
    const cycle = Math.floor(absoluteIndex / pinsData.length);
    const basePin = pinsData[dataIndex];

    return {
      ...basePin,
      id: `${basePin.id}-cycle-${cycle}`,
      liked: false,
      saved: false,
    };
  });
}

function usePinsState() {
  const [pins, setPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const cursorRef = useRef(0);
  const fetchTimeoutRef = useRef(null);

  useEffect(() => {
    const initialLoadTimeout = window.setTimeout(() => {
      const initialPins = createBatch(0, INITIAL_BATCH_SIZE);
      cursorRef.current = INITIAL_BATCH_SIZE;
      setPins(initialPins);
      setIsLoading(false);
    }, 360);

    return () => {
      window.clearTimeout(initialLoadTimeout);
      if (fetchTimeoutRef.current) {
        window.clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  const loadMorePins = useCallback(() => {
    if (isLoading || isFetchingMore) {
      return;
    }

    setIsFetchingMore(true);

    fetchTimeoutRef.current = window.setTimeout(() => {
      const nextPins = createBatch(cursorRef.current, LOAD_BATCH_SIZE);
      cursorRef.current += LOAD_BATCH_SIZE;
      setPins((currentPins) => [...currentPins, ...nextPins]);
      setIsFetchingMore(false);
    }, 420);
  }, [isFetchingMore, isLoading]);

  const toggleLike = useCallback((pinId) => {
    setPins((currentPins) =>
      currentPins.map((pin) => {
        if (pin.id !== pinId) {
          return pin;
        }

        const isNowLiked = !pin.liked;
        return {
          ...pin,
          liked: isNowLiked,
          likes: isNowLiked ? pin.likes + 1 : Math.max(0, pin.likes - 1),
        };
      })
    );
  }, []);

  const toggleSave = useCallback((pinId) => {
    setPins((currentPins) =>
      currentPins.map((pin) => (pin.id === pinId ? { ...pin, saved: !pin.saved } : pin))
    );
  }, []);

  return {
    pins,
    isLoading,
    isFetchingMore,
    loadMorePins,
    toggleLike,
    toggleSave,
  };
}

export default usePinsState;
