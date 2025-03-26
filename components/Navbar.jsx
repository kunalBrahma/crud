import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-violet-800 px-8 py-3 w-full rounded-md">
      <Link className="text-white font-bold text-sm sm:text-2xl" href={"/"}>
      WizScript
      </Link>
      <div className="flex gap-4">
      <Link className="bg-white p-1 px-2 sm:px-2 md:p-2 rounded-md" href={"/addImage"}>
        Add Image
      </Link>
      <Link className="bg-white p-1 px-2 sm:px-2 md:p-2 rounded-md" href={"/addTopic"}>
        Add Topic
      </Link>
      </div>
      
      
    </nav>
  );
}
