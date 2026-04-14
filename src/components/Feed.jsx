import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PinCard from "./PinCard";
import SkeletonCard from "./SkeletonCard";

const SKELETON_SHAPES = ["aspect-[4/5]", "aspect-square", "aspect-[4/3]", "aspect-[4/5]", "aspect-square", "aspect-[4/3]"];

function Feed({
  pins,
  isLoading,
  isFetchingMore,
  hasMore,
  feedError,
  onRetry,
  onLoadMore,
  onToggleLike,
  onToggleSave,
}) {
  const loadTriggerRef = useRef(null);

  useEffect(() => {
    if (!loadTriggerRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          onLoadMore();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(loadTriggerRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  if (isLoading && !pins.length) {
    return (
      <section>
        <div className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4">
          {SKELETON_SHAPES.map((shape, index) => (
            <div key={`initial-skeleton-${index}`} className="mb-5 break-inside-avoid">
              <SkeletonCard shapeClass={shape} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (feedError && !pins.length) {
    return (
      <section className="mx-auto max-w-xl rounded-brand border border-rose-500/35 bg-rose-500/10 p-5 text-center">
        <p className="text-sm font-semibold text-rose-200">Could not load the feed</p>
        <p className="mt-2 text-xs text-rose-100/80">{feedError}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-rose-500/80 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-400"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!pins.length) {
    return (
      <section className="mx-auto max-w-lg rounded-brand border border-white/10 bg-slate-900/45 p-6 text-center">
        <p className="text-sm font-semibold text-white">No pins yet</p>
        <p className="mt-2 text-xs text-slate-300">Create your first pin to start building your feed.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4">
        {pins.map((pin, index) => (
          <div key={pin.id} className="mb-5 break-inside-avoid">
            <PinCard
              pin={pin}
              index={index}
              onToggleLike={onToggleLike}
              onToggleSave={onToggleSave}
            />
          </div>
        ))}

        {(isLoading || isFetchingMore)
          ? SKELETON_SHAPES.map((shape, index) => (
              <div key={`skeleton-${index}`} className="mb-5 break-inside-avoid">
                <SkeletonCard shapeClass={shape} />
              </div>
            ))
          : null}
      </div>

      <div ref={loadTriggerRef} className="h-8" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mt-2 flex max-w-sm items-center justify-center rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-xs text-slate-300"
      >
        {feedError
          ? `Partial feed update issue: ${feedError}`
          : hasMore
            ? "New ideas appear as you scroll"
            : "You reached the end of the feed"}
      </motion.div>
    </section>
  );
}

export default Feed;
