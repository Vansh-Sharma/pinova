import { motion } from "framer-motion";
import { NAV_ITEMS } from "../config/navigation";

function Sidebar({ activeTab, onTabChange, items = NAV_ITEMS }) {
  return (
    <aside className="sticky top-28 hidden h-fit w-64 shrink-0 md:block">
      <nav className="glass-panel rounded-brand p-3">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={() => onTabChange(item.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all ${
                isActive
                  ? "soft-ring bg-indigo-500/20 text-white shadow-glow"
                  : "text-slate-300 hover:bg-slate-800/75 hover:text-white"
              } ${index === items.length - 1 ? "mb-0" : ""}`}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
