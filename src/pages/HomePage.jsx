import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "../layouts/AppLayout";
import Feed from "../components/Feed";
import Modal from "../components/Modal";
import UploadForm from "../components/UploadForm";
import usePinsState from "../hooks/usePinsState";

const INITIAL_FORM = {
  imageUrl: "",
  title: "",
  description: "",
  tagsInput: "",
};

function HomePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const {
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
  } = usePinsState();

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleCreatePin = async () => {
    const isCreated = await createPin(formData);
    if (!isCreated) {
      return;
    }

    setFormData(INITIAL_FORM);
    setIsModalOpen(false);
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab} onOpenModal={handleOpenModal}>
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
        hasMore={hasMore}
        feedError={feedError}
        onRetry={retryInitialFeed}
        onLoadMore={loadMorePins}
        onToggleLike={toggleLike}
        onToggleSave={toggleSave}
      />

      {actionError ? (
        <div className="fixed bottom-24 left-1/2 z-40 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-amber-400/40 bg-amber-500/15 p-3 text-xs text-amber-100">
          <div className="flex items-center justify-between gap-3">
            <span>{actionError}</span>
            <button
              type="button"
              onClick={clearActionError}
              className="rounded-lg bg-amber-400/20 px-2 py-1 text-[10px] font-semibold text-amber-50"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Upload a fresh Pin"
        description="Share visual inspiration with the community."
        footer={
          <>
            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={isCreatingPin}
              onClick={handleCloseModal}
              className="rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={isCreatingPin}
              onClick={handleCreatePin}
              className="rounded-2xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isCreatingPin ? "Publishing..." : "Publish Pin"}
            </motion.button>
          </>
        }
      >
        <UploadForm formData={formData} onChange={handleFormChange} submitError={createPinError} />
      </Modal>
    </AppLayout>
  );
}

export default HomePage;
  const handleOpenModal = () => {
    clearCreatePinError();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isCreatingPin) {
      return;
    }
    clearCreatePinError();
    setIsModalOpen(false);
  };
