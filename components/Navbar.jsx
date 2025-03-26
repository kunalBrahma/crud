import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-slate-800 px-8 py-3 w-full">
      <Link className="text-white font-bold" href={"/"}>
      WizScript
      </Link>
      <div className="flex gap-4">
      <Link className="bg-white p-2 rounded-md" href={"/addImage"}>
        Add Image
      </Link>
      <Link className="bg-white p-2 rounded-md" href={"/addTopic"}>
        Add Topic
      </Link>
      </div>
      
      
    </nav>
  );
}
