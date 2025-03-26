import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Image from "@/models/image";
import path from "path";
import fs from "fs";

export async function PUT(request, { params }) {
  const { id } = params;
  await connectMongoDB();

  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const description = formData.get("description");
    const currentImage = formData.get("currentImage");

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    let imageUrl = currentImage;

    // If a new image was uploaded
    if (file) {
      // Delete old image file
      if (currentImage) {
        const oldImagePath = path.join(process.cwd(), "public", currentImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const buffer = await file.arrayBuffer();
      const filename = Date.now() + "_" + file.name.replace(/\s+/g, "_");
      const filePath = path.join(uploadDir, filename);

      await fs.promises.writeFile(filePath, Buffer.from(buffer));
      imageUrl = `/uploads/${filename}`;
    }

    // Update database
    const updatedImage = await Image.findByIdAndUpdate(
      id,
      { image: imageUrl, description },
      { new: true }
    );

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}