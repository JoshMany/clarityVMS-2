import LoginPage from "./componentPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ServerLogin() {
  const session = await getServerSession(authOptions);

  if (session) return redirect("/");

  return <LoginPage />;
}
