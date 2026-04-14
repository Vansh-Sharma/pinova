import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PinCard from "./PinCard";
import SkeletonCard from "./SkeletonCard";

const SKELETON_SHAPES = ["aspect-[4/5]", "aspect-square", "aspect-[4/3]", "aspect-[4/5]", "aspect-square", "aspect-[4/3]"];

function Feed({ pins, isLoading, isFetchingMore, onLoadMore, onToggleLike, onToggleSave }) {
  const loadTriggerRef = useRef(null);

  useEffect(() => {
    if (!loadTriggerRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(loadTriggerRef.current);
    return () => observer.disconnect();
  }, [isLoading, onLoadMore]);

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
        New ideas appear as you scroll
      </motion.div>
    </section>
  );
}

export default Feed;
