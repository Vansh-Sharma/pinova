import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, Search } from "lucide-react";
import IconButton from "./ui/IconButton";

function Navbar({ onOpenModal, brand = "PinAI", subtitle = "Premium visual discovery" }) {
  const [isCondensed, setIsCondensed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setIsCondensed(currentY > lastScrollYRef.current && currentY > 40);
        lastScrollYRef.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-4 pb-3 pt-4 md:px-6">
      <motion.nav
        initial={false}
        animate={{
          paddingTop: isCondensed ? "0.6rem" : "0.85rem",
          paddingBottom: isCondensed ? "0.6rem" : "0.85rem",
          scale: isCondensed ? 0.986 : 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="glass-panel smooth-shadow mx-auto flex w-full max-w-[1550px] items-center justify-between gap-3 rounded-[24px] px-3 md:px-5"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 rgba(99,102,241,0)",
                "0 0 22px rgba(99,102,241,0.25)",
                "0 0 0 rgba(99,102,241,0)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-sm font-semibold tracking-tight text-white"
          >
            P
          </motion.div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white md:text-base">{brand}</p>
            <p className="hidden text-xs text-slate-300 sm:block">{subtitle}</p>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={
            isFocused
              ? { boxShadow: "0 0 0 1px rgba(99,102,241,0.55), 0 0 24px rgba(99,102,241,0.35)" }
              : { boxShadow: "0 0 0 1px rgba(148,163,184,0.18)" }
          }
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="mx-2 hidden max-w-[520px] flex-1 items-center rounded-2xl bg-slate-800/70 px-3 py-2 md:flex"
        >
          <Search className="mr-2 size-4 text-slate-300" />
          <input
            type="text"
            placeholder="Search styles, creators, vibes..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
          />
        </motion.div>

        <div className="flex items-center gap-2">
          <IconButton
            icon={Bell}
            label="Notifications"
            className="size-10 rounded-2xl bg-slate-800/75 text-slate-200 hover:bg-slate-700/80 hover:text-white"
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -1 }}
            onClick={onOpenModal}
            className="flex items-center gap-2 rounded-2xl bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-indigo-400"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Create</span>
          </motion.button>
        </div>
      </motion.nav>
    </header>
  );
}

export default Navbar;
