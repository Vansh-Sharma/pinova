import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { NAV_ITEMS } from "../config/navigation";

function AppLayout({ activeTab, onTabChange, onOpenModal, children }) {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar onOpenModal={onOpenModal} />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto flex w-full max-w-[1550px] gap-6 px-4 pb-24 pt-4 md:px-6 md:pb-10"
      >
        <Sidebar items={NAV_ITEMS} activeTab={activeTab} onTabChange={onTabChange} />
        <main className="flex-1">{children}</main>
      </motion.div>

      <MobileNav items={NAV_ITEMS} activeTab={activeTab} onTabChange={onTabChange} onOpenModal={onOpenModal} />
    </div>
  );
}

export default AppLayout;
