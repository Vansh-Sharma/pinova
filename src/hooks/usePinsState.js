import { useCallback, useEffect, useRef, useState } from "react";
import {
  createPin as createPinRequest,
  fetchPinsFeed,
  togglePinLike,
  togglePinSave,
} from "../services/pinApi";

const FEED_LIMIT = 20;

function normalizeTagInput(tagInput) {
  return [...new Set(
    tagInput
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, "").toLowerCase())
      .filter(Boolean)
  )];
}

function usePinsState() {
  const [pins, setPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isCreatingPin, setIsCreatingPin] = useState(false);
  const [feedError, setFeedError] = useState("");
  const [actionError, setActionError] = useState("");
  const [createPinError, setCreatePinError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const pendingLikeRef = useRef(new Set());
  const pendingSaveRef = useRef(new Set());

  const loadFeedPage = useCallback(async (page, append = false) => {
    if (append) {
      setIsFetchingMore(true);
    } else {
      setIsLoading(true);
      setFeedError("");
    }

    try {
      const response = await fetchPinsFeed({ page, limit: FEED_LIMIT, type: "latest" });

      setPins((currentPins) => (append ? [...currentPins, ...response.pins] : response.pins));
      setHasMore(response.hasMore);
      pageRef.current = response.page;
      setFeedError("");
    } catch (error) {
      const message = error?.message || "Failed to load feed.";
      setFeedError(message);
    } finally {
      if (append) {
        setIsFetchingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadFeedPage(1, false);
  }, [loadFeedPage]);

  const retryInitialFeed = useCallback(() => {
    loadFeedPage(1, false);
  }, [loadFeedPage]);

  const loadMorePins = useCallback(() => {
    if (isLoading || isFetchingMore || !hasMore) {
      return;
    }

    const nextPage = pageRef.current + 1;
    loadFeedPage(nextPage, true);
  }, [hasMore, isFetchingMore, isLoading, loadFeedPage]);

  const toggleLike = useCallback(async (pinId) => {
    if (pendingLikeRef.current.has(pinId)) {
      return;
    }

    setActionError("");
    pendingLikeRef.current.add(pinId);
    let previousPin = null;

    setPins((currentPins) =>
      currentPins.map((pin) => {
        if (pin.id !== pinId) {
          return pin;
        }

        previousPin = { liked: pin.liked, likesCount: pin.likesCount };
        const liked = !pin.liked;
        return {
          ...pin,
          liked,
          likesCount: liked ? pin.likesCount + 1 : Math.max(0, pin.likesCount - 1),
        };
      })
    );

    try {
      const response = await togglePinLike(pinId);
      setPins((currentPins) =>
        currentPins.map((pin) =>
          pin.id === pinId
            ? { ...pin, liked: response.isLiked, likesCount: response.likesCount }
            : pin
        )
      );
      setActionError("");
    } catch (error) {
      if (previousPin) {
        setPins((currentPins) =>
          currentPins.map((pin) =>
            pin.id === pinId ? { ...pin, ...previousPin } : pin
          )
        );
      }
      setActionError(error?.message || "Could not update like right now.");
    } finally {
      pendingLikeRef.current.delete(pinId);
    }
  }, []);

  const toggleSave = useCallback(async (pinId) => {
    if (pendingSaveRef.current.has(pinId)) {
      return;
    }

    setActionError("");
    pendingSaveRef.current.add(pinId);
    let previousPin = null;

    setPins((currentPins) =>
      currentPins.map((pin) => {
        if (pin.id !== pinId) {
          return pin;
        }

        previousPin = { saved: pin.saved, savesCount: pin.savesCount };
        const saved = !pin.saved;
        return {
          ...pin,
          saved,
          savesCount: saved ? pin.savesCount + 1 : Math.max(0, pin.savesCount - 1),
        };
      })
    );

    try {
      const response = await togglePinSave(pinId);
      setPins((currentPins) =>
        currentPins.map((pin) =>
          pin.id === pinId
            ? { ...pin, saved: response.isSaved, savesCount: response.savesCount }
            : pin
        )
      );
      setActionError("");
    } catch (error) {
      if (previousPin) {
        setPins((currentPins) =>
          currentPins.map((pin) =>
            pin.id === pinId ? { ...pin, ...previousPin } : pin
          )
        );
      }
      setActionError(error?.message || "Could not update save right now.");
    } finally {
      pendingSaveRef.current.delete(pinId);
    }
  }, []);

  const createPin = useCallback(async ({ imageUrl, title, description, tagsInput }) => {
    const trimmedTitle = title.trim();
    const trimmedImage = imageUrl.trim();

    if (!trimmedImage || !trimmedTitle) {
      setCreatePinError("Image URL and title are required.");
      return false;
    }

    setCreatePinError("");
    setIsCreatingPin(true);

    try {
      const pin = await createPinRequest({
        imageUrl: trimmedImage,
        title: trimmedTitle,
        description: description.trim(),
        tags: normalizeTagInput(tagsInput),
      });
      setPins((currentPins) => [pin, ...currentPins]);
      return true;
    } catch (error) {
      setCreatePinError(error?.message || "Failed to create pin.");
      return false;
    } finally {
      setIsCreatingPin(false);
    }
  }, []);

  const clearActionError = useCallback(() => {
    setActionError("");
  }, []);

  const clearCreatePinError = useCallback(() => {
    setCreatePinError("");
  }, []);

  return {
    pins,
    isLoading,
    isFetchingMore,
    isCreatingPin,
    hasMore,
    feedError,
    actionError,
    createPinError,
    loadMorePins,
    retryInitialFeed,
    toggleLike,
    toggleSave,
    createPin,
    clearActionError,
    clearCreatePinError,
  };
}

export default usePinsState;
