import { NextResponse } from "next/server";
import connectMongoDB from "@/libs/mongodb";
import Image from "@/models/image";
import path from "path";
import fs from "fs";

export async function POST(request) {
  await connectMongoDB();

  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const description = formData.get("description");

    if (!file || !description) {
      return NextResponse.json(
        { error: "Image and description are required" },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create unique filename
    const buffer = await file.arrayBuffer();
    const filename = Date.now() + "_" + file.name.replace(/\s+/g, "_");
    const filePath = path.join(uploadDir, filename);

    // Write file to filesystem
    await fs.promises.writeFile(filePath, Buffer.from(buffer));

    // Save to database
    const imageUrl = `/uploads/${filename}`;
    const newImage = await Image.create({ 
      image: imageUrl, 
      description 
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const images = await Image.find();
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching images" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectMongoDB();
    
    // Parse the JSON body
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing image ID" }, 
        { status: 400 }
      );
    }

    const image = await Image.findById(id);

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" }, 
        { status: 404 }
      );
    }

    // Delete the file from local storage
    const imagePath = path.join(process.cwd(), "public", image.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Image.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Image deleted successfully" }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Error deleting image" }, 
      { status: 500 }
    );
  }
}