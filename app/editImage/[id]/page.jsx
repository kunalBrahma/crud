import EditImage from "@/components/EditImage";
import { fetchImage } from "@/libs/fetchImage"; // You'll need to create this helper

export default async function EditImagePage({ params }) {
  const { id } = params;
  
  try {
    const image = await fetchImage(id);
    
    if (!image) {
      return <div className="text-center py-8">Image not found</div>;
    }

    return (
      <EditImage 
        id={image._id} 
        initialImage={image.image} 
        initialDescription={image.description} 
      />
    );
  } catch (error) {
    return <div className="text-red-500 text-center py-8">Error loading image: {error.message}</div>;
  }
}