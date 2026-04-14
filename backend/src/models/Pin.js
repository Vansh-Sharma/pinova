import mongoose from "mongoose";

const pinSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
      select: false,
    },
    savedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
      select: false,
    },
    likesCount: {
      type: Number,
      default: 0,
      index: true,
    },
    savesCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

pinSchema.index({ createdAt: -1 });
pinSchema.index({ likesCount: -1, savesCount: -1, createdAt: -1 });

const Pin = mongoose.model("Pin", pinSchema);

export default Pin;
