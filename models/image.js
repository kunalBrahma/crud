import mongoose, { Schema } from "mongoose";

// Define Image Schema
const imageSchema = new Schema(
  {
    image: { type: String, required: true }, // Store image URL or path
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image; 
