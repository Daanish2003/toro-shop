import Navbar from "@/components/home/navbar";
import Todolist from "./_components/todolist";

export default async function Home() {
  return (
    <>
       <Navbar />
       <Todolist />
    </>
  );
}
