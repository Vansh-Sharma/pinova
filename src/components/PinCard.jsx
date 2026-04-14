import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Heart, Send } from "lucide-react";
import IconButton from "./ui/IconButton";

function PinCard({ pin, index, onToggleLike, onToggleSave }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const likesCount = Number(pin.likesCount || 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.28, delay: (index % 8) * 0.03, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group break-inside-avoid rounded-brand border border-white/5 bg-brand-card/95 p-3 smooth-shadow"
    >
      <div className={`relative w-full overflow-hidden rounded-2xl ${pin.shapeClass}`}>
        <AnimatePresence>
          {!isLoaded ? (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-slate-700/85 to-slate-600/30"
            />
          ) : null}
        </AnimatePresence>

        <motion.img
          src={pin.imageUrl}
          alt={pin.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="h-full w-full object-cover"
        />

        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-400/5 via-transparent to-indigo-500/20"
        />

        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute right-2 top-2 flex gap-2"
        >
          <IconButton
            icon={Heart}
            label="Like"
            onClick={() => onToggleLike(pin.id)}
            filled={pin.liked}
            className={pin.liked ? "bg-rose-500 text-white hover:bg-rose-400" : ""}
          />
          <IconButton
            icon={Bookmark}
            label="Save"
            onClick={() => onToggleSave(pin.id)}
            filled={pin.saved}
            className={pin.saved ? "bg-indigo-500 text-white hover:bg-indigo-400" : ""}
          />
          <IconButton icon={Send} label="Share" />
        </motion.div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="line-clamp-1 text-sm font-semibold text-white md:text-[15px]">{pin.title}</p>
          <p className="text-[11px] font-medium text-slate-400">{likesCount} likes</p>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-slate-300 md:text-sm">{pin.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pin.tags.map((tag) => (
            <span
              key={`${pin.id}-${tag}`}
              className="rounded-full border border-indigo-400/35 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default PinCard;
