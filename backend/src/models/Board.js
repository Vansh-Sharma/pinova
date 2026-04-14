import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    pins: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Pin",
      default: [],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

boardSchema.index({ owner: 1, createdAt: -1 });

const Board = mongoose.model("Board", boardSchema);

export default Board;
