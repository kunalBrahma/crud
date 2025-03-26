import connectMongoDB from "./mongodb";
import Image from "@/models/image";

export async function fetchImage(id) {
  await connectMongoDB();
  const image = await Image.findById(id);
  return image;
}