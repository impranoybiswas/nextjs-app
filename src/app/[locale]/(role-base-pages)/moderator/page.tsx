import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ModeratorPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Double check — middleware already করেছে, কিন্তু server side এও verify
  if (
    !session ||
    (session.user.role !== "moderator" && session.user.role !== "admin")
  ) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-red-700">Moderator Only Page</h1>
      <p>Total control here.</p>
    </div>
  );
}
