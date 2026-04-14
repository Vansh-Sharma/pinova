import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { NAV_ITEMS } from "../config/navigation";

function MobileNav({ activeTab, onTabChange, onOpenModal, items = NAV_ITEMS }) {
  const mobileItems = items.filter((item) => item.id !== "profile");

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onOpenModal}
        className="fixed bottom-20 right-5 z-30 grid size-14 place-items-center rounded-full bg-indigo-500 text-white shadow-glow md:hidden"
      >
        <motion.span
          animate={{ scale: [1, 1.12, 1], opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-indigo-400/30"
        />
        <Plus className="relative z-10 size-6" />
      </motion.button>

      <nav className="glass-panel fixed bottom-4 left-1/2 z-20 flex w-[94%] -translate-x-1/2 items-center justify-around rounded-[22px] px-2 py-2 md:hidden">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => onTabChange(item.id)}
              className={`flex min-w-14 flex-col items-center rounded-xl px-2 py-1.5 text-[11px] font-medium transition-colors ${
                isActive ? "text-white" : "text-slate-300"
              }`}
            >
              <div
                className={`mb-1 grid size-8 place-items-center rounded-lg ${
                  isActive ? "bg-indigo-500/25 shadow-glow" : "bg-slate-800/70"
                }`}
              >
                <Icon className="size-4" />
              </div>
              {item.mobileLabel || item.label}
            </motion.button>
          );
        })}
      </nav>
    </>
  );
}

export default MobileNav;
