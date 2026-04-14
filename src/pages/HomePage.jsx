import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "../layouts/AppLayout";
import Feed from "../components/Feed";
import Modal from "../components/Modal";
import UploadForm from "../components/UploadForm";
import usePinsState from "../hooks/usePinsState";

function HomePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { pins, isLoading, isFetchingMore, loadMorePins, toggleLike, toggleSave } = usePinsState();

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab} onOpenModal={() => setIsModalOpen(true)}>
      <section className="mb-6 pt-2 md:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Visual ideas, reimagined
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
          Scroll-worthy inspiration crafted by AI taste-makers and creators.
        </p>
      </section>

      <Feed
        pins={pins}
        isLoading={isLoading}
        isFetchingMore={isFetchingMore}
        onLoadMore={loadMorePins}
        onToggleLike={toggleLike}
        onToggleSave={toggleSave}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload a fresh Pin"
        description="Share visual inspiration with the community."
        footer={
          <>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsModalOpen(false)}
              className="rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 hover:text-white"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-indigo-400"
            >
              Publish Pin
            </motion.button>
          </>
        }
      >
        <UploadForm />
      </Modal>
    </AppLayout>
  );
}

export default HomePage;
