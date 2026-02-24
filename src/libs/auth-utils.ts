import { auth } from "@/libs/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuthUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session.user;
}
